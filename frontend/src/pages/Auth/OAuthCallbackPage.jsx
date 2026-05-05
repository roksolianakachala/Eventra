import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../app/providers";
import { getUserFromJwtToken, getUserFromToken } from "../../services/authService";
import "./AuthPages.css";

function OAuthCallbackPage() {
  const navigate = useNavigate();
  const { completeOAuthLogin } = useAuth();

  useEffect(() => {
    async function finishGoogleLogin() {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#\/?/, ""));
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

      if (!token) {
        alert("Не вдалося завершити вхід через Google: token не знайдено");
        navigate("/login", { replace: true });
        return;
      }

      try {
        let user = userParam ? JSON.parse(userParam) : null;

        if (!user) {
          try {
            user = await getUserFromToken(token);
          } catch {
            user = getUserFromJwtToken(token);
          }
        }

        if (!user) {
          throw new Error("Missing Google user");
        }

        completeOAuthLogin({ token, user });
        window.history.replaceState(null, "", "/profile");
        navigate("/profile", { replace: true });
      } catch {
        alert("Не вдалося прочитати дані Google-акаунта");
        navigate("/login", { replace: true });
      }
    }

    finishGoogleLogin();
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
