import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch() {}

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            minHeight: "100vh",
            background: "#000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            padding: "2rem",
            fontFamily: "'Inter', sans-serif",
          }}
        >
          <div style={{ fontSize: "5rem", marginBottom: "1rem" }}>🎬</div>

          <h1
            style={{
              fontSize: "2.5rem",
              fontWeight: 900,
              color: "#FAC400",
              marginBottom: "0.5rem",
            }}
          >
            Oops! Reel Broke
          </h1>

          <p
            style={{
              color: "#9ca3af",
              maxWidth: "420px",
              lineHeight: 1.6,
              marginBottom: "2rem",
              fontSize: "1rem",
            }}
          >
            Something went wrong behind the scenes. Please go back to the home page.
          </p>

          <button
            onClick={this.handleReload}
            style={{
              background: "#FAC400",
              color: "#000",
              border: "none",
              padding: "0.75rem 2rem",
              borderRadius: "9999px",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              boxShadow: "0 4px 24px rgba(250,196,0,0.35)",
            }}
          >
            Back to Home
          </button>

          {import.meta.env.DEV && this.state.error && (
            <details
              style={{
                marginTop: "2rem",
                color: "#6b7280",
                fontSize: "0.75rem",
                maxWidth: "600px",
                textAlign: "left",
              }}
            >
              <summary style={{ cursor: "pointer", color: "#FAC400" }}>
                Dev: error details
              </summary>
              <pre style={{ whiteSpace: "pre-wrap", marginTop: "0.5rem" }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
