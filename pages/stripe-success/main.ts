import { initPage } from '~/shared/utils/page-init';
import './style.css';
import { extractStripeSuccessParams, formatStripeSuccessLog } from './utils';

// Internationalization (i18n) - Inline translations
const translations = {
    en: {
        // Language: English
        lang: 'en',
        // Page
        pageTitle: 'Doctorina | Payment Successful',
        // Success message
        successTitle: 'Payment Successful!',
        successMessage: 'Thank you for your payment. Your transaction has been completed successfully.',
        // Redirect
        redirectingIn: 'Redirecting in',
        seconds: 'seconds...',
        continueNow: 'Continue Now',
        // Session
        sessionId: 'Session ID:',
    },
    ru: {
        // Язык: Русский
        lang: 'ru',
        // Страница
        pageTitle: 'Doctorina | Оплата успешна',
        // Сообщение об успехе
        successTitle: 'Оплата успешна!',
        successMessage: 'Спасибо за оплату. Ваша транзакция успешно завершена.',
        // Редирект
        redirectingIn: 'Перенаправление через',
        seconds: 'секунд...',
        continueNow: 'Продолжить',
        // Сессия
        sessionId: 'ID сессии:',
    },
    es: {
        // Idioma: Español
        lang: 'es',
        // Página
        pageTitle: 'Doctorina | Pago exitoso',
        // Mensaje de éxito
        successTitle: '¡Pago exitoso!',
        successMessage: 'Gracias por su pago. Su transacción se ha completado con éxito.',
        // Redirección
        redirectingIn: 'Redirigiendo en',
        seconds: 'segundos...',
        continueNow: 'Continuar ahora',
        // Sesión
        sessionId: 'ID de sesión:',
    },
    de: {
        // Sprache: Deutsch
        lang: 'de',
        // Seite
        pageTitle: 'Doctorina | Zahlung erfolgreich',
        // Erfolgsmeldung
        successTitle: 'Zahlung erfolgreich!',
        successMessage: 'Vielen Dank für Ihre Zahlung. Ihre Transaktion wurde erfolgreich abgeschlossen.',
        // Weiterleitung
        redirectingIn: 'Weiterleitung in',
        seconds: 'Sekunden...',
        continueNow: 'Jetzt fortfahren',
        // Sitzung
        sessionId: 'Sitzungs-ID:',
    },
    fr: {
        // Langue: Français
        lang: 'fr',
        // Page
        pageTitle: 'Doctorina | Paiement réussi',
        // Message de succès
        successTitle: 'Paiement réussi !',
        successMessage: 'Merci pour votre paiement. Votre transaction a été complétée avec succès.',
        // Redirection
        redirectingIn: 'Redirection dans',
        seconds: 'secondes...',
        continueNow: 'Continuer maintenant',
        // Session
        sessionId: 'ID de session :',
    },
    pt: {
        // Idioma: Português
        lang: 'pt',
        // Página
        pageTitle: 'Doctorina | Pagamento bem-sucedido',
        // Mensagem de sucesso
        successTitle: 'Pagamento bem-sucedido!',
        successMessage: 'Obrigado pelo seu pagamento. Sua transação foi concluída com sucesso.',
        // Redirecionamento
        redirectingIn: 'Redirecionando em',
        seconds: 'segundos...',
        continueNow: 'Continuar agora',
        // Sessão
        sessionId: 'ID da sessão:',
    },
    it: {
        // Lingua: Italiano
        lang: 'it',
        // Pagina
        pageTitle: 'Doctorina | Pagamento riuscito',
        // Messaggio di successo
        successTitle: 'Pagamento riuscito!',
        successMessage: 'Grazie per il pagamento. La transazione è stata completata con successo.',
        // Reindirizzamento
        redirectingIn: 'Reindirizzamento tra',
        seconds: 'secondi...',
        continueNow: 'Continua ora',
        // Sessione
        sessionId: 'ID sessione:',
    },
    zh: {
        // 语言：中文
        lang: 'zh',
        // 页面
        pageTitle: 'Doctorina | 支付成功',
        // 成功消息
        successTitle: '支付成功！',
        successMessage: '感谢您的付款。您的交易已成功完成。',
        // 重定向
        redirectingIn: '将在',
        seconds: '秒后重定向...',
        continueNow: '立即继续',
        // 会话
        sessionId: '会话ID：',
    },
    ja: {
        // 言語：日本語
        lang: 'ja',
        // ページ
        pageTitle: 'Doctorina | 支払い成功',
        // 成功メッセージ
        successTitle: '支払い成功！',
        successMessage: 'お支払いありがとうございます。取引が正常に完了しました。',
        // リダイレクト
        redirectingIn: '',
        seconds: '秒後にリダイレクトします...',
        continueNow: '今すぐ続ける',
        // セッション
        sessionId: 'セッションID：',
    },
    ar: {
        // اللغة: العربية
        lang: 'ar',
        // الصفحة
        pageTitle: 'Doctorina | الدفع ناجح',
        // رسالة النجاح
        successTitle: 'الدفع ناجح!',
        successMessage: 'شكراً لك على الدفع. تمت عملية الدفع بنجاح.',
        // إعادة التوجيه
        redirectingIn: 'إعادة التوجيه خلال',
        seconds: 'ثواني...',
        continueNow: 'المتابعة الآن',
        // الجلسة
        sessionId: 'معرّف الجلسة:',
    },
};

// Detect browser language with fallback to English
function detectLanguage(): keyof typeof translations {
    const browserLang = navigator.language.split('-')[0].toLowerCase();
    const supportedLanguages: (keyof typeof translations)[] = ['en', 'ru', 'es', 'de', 'fr', 'pt', 'it', 'zh', 'ja', 'ar'];
    return supportedLanguages.includes(browserLang as keyof typeof translations) ? (browserLang as keyof typeof translations) : 'en';
}

// Get current language and translations
const currentLang = detectLanguage();
const t = translations[currentLang];

// Update HTML lang attribute
document.documentElement.lang = currentLang;

// Set text direction for RTL languages
if (currentLang === 'ar') {
    document.documentElement.dir = 'rtl';
}

initPage(t.pageTitle);

const app = document.getElementById('app');
if (app) {
    // Get session from URL if present
    const urlParams = new URLSearchParams(window.location.search);
    const params = extractStripeSuccessParams(urlParams);

    // Log extracted parameters
    console.log(formatStripeSuccessLog(params));

    // Send POST callback with payment status
    async function sendCallback() {
        // Determine callback URL based on environment and purchase ID
        function getCallbackUrl(): string | undefined {
            const purchaseId = params.purchaseId;
            if (!purchaseId) return undefined;
            switch (params.environment) {
                case 'stg':
                case 'stage':
                case 'staging':
                    return `https://staging.api.doctorina.com/v1/subscriptions/${purchaseId}/sync`;
                case 'prod':
                case 'live':
                case 'production':
                    return `https://live.api.doctorina.com/v1/subscriptions/${purchaseId}/sync`;
                default:
                    return undefined;
            }
        }

        const callbackUrl = getCallbackUrl();
        if (!callbackUrl) {
            console.log('Callback URL not determined, skipping callback');
            return;
        }

        const body: { source: string; status?: string; type?: string; checkout_id?: string; } = {
            source: 'stripe',
            status: 'success'
        };

        if (params.type)
            body.type = params.type;

        if (params.checkoutId)
            body.checkout_id = params.checkoutId;

        try {
            const response = await fetch(callbackUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (response.ok) {
                console.log('Callback sent successfully');
            } else {
                console.error('Callback failed with status:', response.status);
            }
        } catch (error) {
            console.error('Error sending callback:', error);
        }
    }

    sendCallback();

    // Safely decode and validate redirect URL
    const redirectParam = params.redirectUrl;
    let redirectUrl = 'https://app.doctorina.com';

    if (redirectParam) {
        try {
            // Decode URL-encoded parameter
            let decodedUrl = decodeURIComponent(redirectParam);

            // Auto-prepend https:// if no scheme is specified
            if (!/^https?:\/\//i.test(decodedUrl)) {
                decodedUrl = 'https://' + decodedUrl;
            }

            // Validate that URL is safe (same origin or whitelisted domain)
            const url = new URL(decodedUrl, window.location.origin);

            // Whitelist of allowed domains for redirect (supports wildcards)
            // E.g.
            // http://localhost:3000/stripe-success?r=doctorina-development.web.app
            const allowedDomains = [
                '*.doctorina.com',
                '*.web.app',
                'localhost'
            ];

            const hostname = url.hostname.toLowerCase();
            const isAllowed = allowedDomains.some(pattern => {
                if (pattern.startsWith('*.')) {
                    // Wildcard pattern: *.example.com matches subdomain.example.com and example.com
                    const domain = pattern.slice(2);
                    return hostname === domain || hostname.endsWith('.' + domain);
                } else {
                    // Exact match
                    return hostname === pattern;
                }
            });

            if (isAllowed) {
                redirectUrl = decodedUrl;
            } else {
                console.warn('Redirect URL not in whitelist:', hostname);
            }
        } catch (error) {
            console.error('Invalid redirect URL:', error);
        }
    }

    app.innerHTML = `
    <div class="container">
      <div class="success-animation">
        <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
          <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
          <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
        </svg>
      </div>
      <h1>${t.successTitle}</h1>
      <p class="message">${t.successMessage}</p>
      <div class="redirect-info">
        <p class="redirect-text">${t.redirectingIn} <span id="countdown">15</span> ${t.seconds}</p>
        <div class="progress-bar">
          <div class="progress-fill" id="progress"></div>
        </div>
      </div>
      <div class="actions">
        <a href="${redirectUrl}" class="btn btn-primary" id="redirect-btn">${t.continueNow}</a>
      </div>
    </div>
  `;

    // Auto-redirect with countdown
    let countdown = 15;
    const countdownElement = document.getElementById('countdown');
    const progressElement = document.getElementById('progress');
    const redirectBtn = document.getElementById('redirect-btn') as HTMLAnchorElement | null;

    // Store redirect URL for the button
    if (redirectBtn) {
        redirectBtn.href = redirectUrl;
    }

    const countdownInterval = setInterval(() => {
        countdown--;
        if (countdownElement) {
            countdownElement.textContent = countdown.toString();
        }

        // Update progress bar
        if (progressElement) {
            const progress = ((15 - countdown) / 15) * 100;
            progressElement.style.width = `${progress}%`;
        }

        if (countdown <= 0) {
            clearInterval(countdownInterval);
            window.location.href = redirectUrl;
        }
    }, 1000);

    // Cancel auto-redirect if user clicks the button
    if (redirectBtn) {
        redirectBtn.addEventListener('click', () => {
            clearInterval(countdownInterval);
        });
    }
}
