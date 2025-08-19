self.addEventListener("push", function (event) {
    let data = {};

    try {
        data = event.data.json();
    } catch (e) {
        console.error("Push event but no JSON data", e);
        data = { title: "📢 Default Title", body: "This is a default body." };
    }

    const title = data.title || "📢 Default Title";
    const options = {
        body: data.body || "This is a default notification.",
        icon: data.icon || "/icon.png",
        tag: data.tag || "default-tag"
    };

    event.waitUntil(
        self.registration.showNotification(title, options)
    );
});
