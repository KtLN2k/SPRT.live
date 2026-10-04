import {FaDiscord,FaFacebookF,FaTiktok,FaYoutube} from "react-icons/fa6";

export function SiteFooter({compact=false}:{compact?:boolean}) {
  return <footer className={`site-footer ${compact?"site-footer-compact":""}`} dir="rtl">
    <div className="site-footer-inner">
      <div className="site-footer-copy">
        <strong dir="ltr">SPRT.fan</strong>
        <span>© 2026 כל הזכויות שמורות</span>
      </div>
      <div className="site-footer-social" aria-label="רשתות חברתיות">
        <span className="social-facebook" role="img" aria-label="Facebook" title="Facebook"><FaFacebookF/></span>
        <span className="social-tiktok" role="img" aria-label="TikTok" title="TikTok"><FaTiktok/></span>
        <span className="social-youtube" role="img" aria-label="YouTube" title="YouTube"><FaYoutube/></span>
        <span className="social-discord" role="img" aria-label="Discord" title="Discord"><FaDiscord/></span>
      </div>
    </div>
  </footer>;
}
