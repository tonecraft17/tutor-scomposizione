#!/usr/bin/env python3
"""Local development server for Tutor · Progressive Breakdown.

Why it exists: `python -m http.server` does NOT send cache headers
(no `Cache-Control`). The browser can therefore serve, from its cache,
the ES modules (app.js, engine/*.js, data/*.js) of a PREVIOUS version
of the app downloaded in the same folder/port: this actually happened
(after an update the changes seemed to «have no effect»).
This server sends `Cache-Control: no-store` on every response, so the
browser ALWAYS loads the current files from disk.

Usage:
    python3 serve.py            # http://localhost:8000
    python3 serve.py 9000       # different port

Alternative (after every app update do a hard refresh,
Ctrl+F5 / Cmd+Shift+R, or serve this page with this script):
    python3 -m http.server 8000
"""
import http.server
import socketserver
import sys
import webbrowser
from pathlib import Path

ROOT = Path(__file__).resolve().parent


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    """SimpleHTTPRequestHandler with caching disabled on every response."""

    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(ROOT), **kwargs)

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):  # compact one-line log
        sys.stderr.write("· %s %s\n" % (self.address_string(), fmt % args))


def main():
    porta = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    # allow_reuse_address avoids «Address already in use» on a quick restart
    socketserver.TCPServer.allow_reuse_address = True
    try:
        with socketserver.TCPServer(("", porta), NoCacheHandler) as httpd:
            url = "http://localhost:%d/" % porta
            print("Tutor · Progressive Breakdown — development server")
            print("  serving at %s  (Ctrl+C to stop)" % url)
            print("  caching disabled (Cache-Control: no-store)")
            # open the browser only if there is a display (not in headless CI/SSH)
            if sys.stdout.isatty():
                try:
                    webbrowser.open(url)
                except Exception:
                    pass
            httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nServer stopped.")
    except OSError as e:
        print("Error: %s (port already in use? try another one: python3 serve.py 8001)" % e)
        sys.exit(1)


if __name__ == "__main__":
    main()
