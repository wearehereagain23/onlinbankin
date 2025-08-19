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

    await fetch("/subscribe", {
        method: "POST",
        body: JSON.stringify({ subscription, title, message }),
        headers: { "content-type": "application/json" }
    });

    console.log("✅ Custom notification request sent!");
    //////// Notification to database
    const { data, error } = await window.supabase
        .from('onlinbankinNotification')
        .insert({
            title: title,
            message: message,
            date: new Date(),
            uuid: i,
        })
    if (error) {
        alert('something went wrong, if the continue please contact developer');
    } else {
        alert('notification sent!');
    }
});

// Helper: Convert base64 → Uint8Array
function urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const rawData = atob(base64);
    return Uint8Array.from([...rawData].map(c => c.charCodeAt(0)));
}