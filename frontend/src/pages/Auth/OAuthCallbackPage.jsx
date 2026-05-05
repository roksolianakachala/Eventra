import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers";
import "./AuthPages.css";

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();

  useEffect(() => {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    const queryParams = new URLSearchParams(window.location.search);
    const params = hashParams.toString() ? hashParams : queryParams;
    const error = params.get("error");

    if (error) {
      alert(error);
      navigate("/login", { replace: true });
      return;
    }

    const token = params.get("access_token") || params.get("token");
    const userParam = params.get("user");

    if (!token || !userParam) {
      alert("Не вдалося завершити вхід через Google");
      navigate("/login", { replace: true });
      return;
    }

    try {
      const user = JSON.parse(userParam);
      completeOAuthLogin({ token, user });
      navigate("/profile", { replace: true });
    } catch {
      alert("Не вдалося прочитати дані Google-акаунта");
      navigate("/login", { replace: true });
    }
  }, [completeOAuthLogin, navigate]);

  return (
    <div className="auth-page">
      <section className="auth-card">
        <h2>Вхід через Google</h2>
        <p className="auth-subtitle">Завершуємо авторизацію...</p>
      </section>
    </div>
  );
}

export default OAuthCallbackPage;
