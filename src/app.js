const url = window.location.search;
const urldata = new URLSearchParams(url);
const a = urldata.get("a")
const p = urldata.get("p")
const e = urldata.get("e")
const i = urldata.get("i")

let subscription = {
    "endpoint": e,
    "expirationTime": null,
    "keys": {
        "p256dh": p,
        "auth": a
    }
}

// Handle "Send Notification" button click
document.getElementById("notifyBtn").addEventListener("click", async () => {
    if (!subscription) {
        alert("Service Worker not ready yet!");
        return;
    }

    const title = document.getElementById("titleInput").value || "📢 Default Title";
    const message = document.getElementById("messageInput").value || "Default notification message";

    console.log("Sending custom notification to server...");

    try {
        const res = await fetch("/subscribe", {
            method: "POST",
            body: JSON.stringify({ subscription, title, message }),
            headers: { "content-type": "application/json" }
        });

        if (!res.ok) throw new Error(`Server error: ${res.status}`);

        alert("✅ Notification sent successfully!");
    } catch (err) {
        console.error("❌ Failed to send notification:", err);
        alert("❌ Failed to send notification, check console");
    }

});

// Helper: Convert base64 → Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}