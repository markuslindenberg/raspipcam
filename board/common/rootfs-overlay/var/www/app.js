var janus = null;
var streaming = null;

Janus.init({
    // debug: "all",
    debug: ["warn", "error"],
    dependencies: Janus.useDefaultDependencies(),
    callback: function() {
        if(!Janus.isWebrtcSupported()) {
            Janus.log("No WebRTC support... ");
            return;
        }
        janus = new Janus({
            server: [
                "ws://" + window.location.hostname + ":8080/",
                "http://" + window.location.hostname + ":8088/janus"
            ],
            success: function() {
                janus.attach({
                    plugin: "janus.plugin.streaming",
                    opaqueId: Janus.randomString(12),
                    success: function(pluginHandle) {
                        streaming = pluginHandle;
                        Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
                        streaming.send({ message: { request: "watch", id: 1} });
                    },
                    error: function(error) {
                        Janus.error("  -- Error attaching plugin... ", error);
                    },
                    iceState: function(state) {
                        Janus.log("ICE state changed to " + state);
                    },
                    webrtcState: function(on) {
                        Janus.log("Janus says our WebRTC PeerConnection is " + (on ? "up" : "down") + " now");
                    },
                    onmessage: function(msg, jsep) {
                        Janus.debug(" ::: Got a message :::", msg);
                        if(msg["error"] || (msg["result"] && msg["result"]["status"] && msg["result"]["status"] === 'stopped')) {
                            streaming.send({ message: { request: "stop" } });
                            streaming.hangup();
                            return;
                        }
                        if(jsep) {
                            Janus.debug("Handling SDP as well...", jsep);
                            streaming.createAnswer({
                                jsep: jsep,
                                media: { audioSend: false, videoSend: false, data: false },
                                success: function(jsep) {
                                    Janus.debug("Got SDP!", jsep);
                                    streaming.send({ message: { request: "start" }, jsep: jsep });
                                },
                                error: function(error) {
                                    Janus.error("WebRTC error:", error);
                                }
                            });
                        }
                    },
                    onremotestream: function(stream) {
                        Janus.debug(" ::: Got a remote stream :::", stream);
                        var video = document.getElementById('video');
                        Janus.attachMediaStream(video, stream);
                        // video.play();
                    }
                });
            },
            error: function(error) {
                Janus.error(error);
            },
            destroyed: function() {
                window.location.reload();
            }
        });
    }
});
