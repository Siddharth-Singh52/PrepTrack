import { Link } from "react-router-dom";

function NotFound() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                background: "#111827",
                padding: "20px",
            }}
        >
            <div
                style={{
                    background:"#1f2437",
                    padding:"70px 60px",
                    borderRadius:"24px",
                    border:"1px solid rgba(255,255,255,.08)",
                    textAlign:"center",
                    maxWidth:"700px",
                    width:"100%"
                }}
            >
                <h1
                    style={{
                        fontSize: "110px",
                        color: "#6366f1",
                        fontWeight: "700",
                        margin: 0,
                        lineHeight: "1",
                    }}
                >
                    404
                </h1>

                <h2
                    style={{
                        color: "white",
                        fontSize: "40px",
                        marginTop: "20px",
                        marginBottom: "20px",
                        fontWeight: "700",
                    }}
                >
                    Page Not Found
                </h2>

                <p
                    style={{
                        color: "#94a3b8",
                        fontSize: "18px",
                        lineHeight: "1.8",
                        maxWidth: "420px",
                        margin: "0 auto 35px",
                    }}
                >
                    The page you're looking for doesn't exist or may have been moved.
                </p>

                <Link
                    to="/dashboard"
                    style={{
                        display: "inline-block",
                        background: "#6366f1",
                        color: "white",
                        textDecoration: "none",
                        padding: "15px 34px",
                        borderRadius: "12px",
                        fontWeight: "600",
                        fontSize: "17px",
                    }}
                >
                    ← Back to Dashboard
                </Link>
            </div>
        </div>
    );
}

export default NotFound;