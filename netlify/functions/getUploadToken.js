// netlify/functions/getUploadToken.js
exports.handler = async (event) => {
  try {
    // Accept both lowercase and uppercase header
    const clientPass = event.headers["x-admin-pass"] || event.headers["X-Admin-Pass"];

    // Debug logs (optional)
    console.log("Received password:", clientPass, "Expected:", process.env.ADMIN_PASSWORD);

    // Unauthorized
    if (!clientPass || clientPass !== process.env.ADMIN_PASSWORD) {
      return {
        statusCode: 403,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*", // ✅ CORS
          "Access-Control-Allow-Headers": "X-Admin-Pass,Content-Type"
        },
        body: JSON.stringify({ ok: false, error: "Unauthorized" })
      };
    }

    // Authorized — return GitHub token, repo, branch
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "X-Admin-Pass,Content-Type"
      },
      body: JSON.stringify({
        token: process.env.GITHUB_TOKEN,
        repo: process.env.GITHUB_REPO,
        branch: process.env.GITHUB_BRANCH
      })
    };

  } catch (err) {
    console.log("Error in getUploadToken:", err);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
};
