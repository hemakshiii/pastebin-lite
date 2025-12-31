const express = require("express");
const router = express.Router();
const { viewPasteHTML } = require("./controller");


router.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Pastebin Lite</title>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet">
    </head>
    <body>
      <div class="container mt-5">
        <h1 class="mb-4">Pastebin Lite</h1>
        <div id="alert" class="alert d-none" role="alert"></div>
        <form id="pasteForm">
          <div class="mb-3">
            <label for="content" class="form-label">Paste Content</label>
            <textarea class="form-control" id="content" rows="5" required></textarea>
          </div>
          <div class="mb-3">
            <label for="ttl" class="form-label">TTL (seconds, optional)</label>
            <input type="number" class="form-control" id="ttl" min="1">
          </div>
          <div class="mb-3">
            <label for="maxViews" class="form-label">Max Views (optional)</label>
            <input type="number" class="form-control" id="maxViews" min="1">
          </div>
          <button type="submit" class="btn btn-primary">Create Paste</button>
        </form>
        <div class="mt-4" id="result"></div>
      </div>

      <script>
        const form = document.getElementById('pasteForm');
        const resultDiv = document.getElementById('result');
        const alertDiv = document.getElementById('alert');

        form.addEventListener('submit', async (e) => {
          e.preventDefault();
          resultDiv.innerHTML = '';
          alertDiv.classList.add('d-none');

          const content = document.getElementById('content').value.trim();
          const ttl_seconds = document.getElementById('ttl').value;
          const max_views = document.getElementById('maxViews').value;

          const body = { content };
          if (ttl_seconds) body.ttl_seconds = parseInt(ttl_seconds);
          if (max_views) body.max_views = parseInt(max_views);

          try {
            const res = await fetch('/api/pastes', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(body)
            });

            const data = await res.json();
            if (res.ok) {
              resultDiv.innerHTML = \`<div class="alert alert-success">Paste created! <a href="/p/\${data.id}" target="_blank">View Paste</a></div>\`;
              form.reset();
            } else {
              alertDiv.classList.remove('d-none');
              alertDiv.classList.add('alert-danger');
              alertDiv.innerText = data.error || 'Error creating paste';
            }
          } catch (err) {
            alertDiv.classList.remove('d-none');
            alertDiv.classList.add('alert-danger');
            alertDiv.innerText = 'Server error';
          }
        });
      </script>
    </body>
    </html>
  `);
});


router.get("/p/:id", viewPasteHTML);

module.exports = router;
