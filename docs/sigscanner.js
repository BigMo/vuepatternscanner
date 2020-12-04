function performScan(self, buffer, bytes, mask, start, end) {
    var data = new Uint8Array(buffer)
    var found = false;
    var lastProgress = new Date();

    for (var i = start; i < end - mask.length; i++) {
        found = true;
        for (var d = 0; d < mask.length; d++) {
            if (mask[d] == '?') continue;
            if (bytes[d] != data[i + d]) {
                found = false;
                break;
            }
        }
        if (found) {
            self.postMessage({
                type: 'found',
                bytes: data.slice(i, i + mask.length),
                offset: i
            })
        }
        if (new Date() - lastProgress > 100) {
            lastProgress = new Date();
            var len = end - start;
            self.postMessage({
                type: 'progress',
                progress:(i-start)/len
            })
        }
    }
    self.postMessage({
        type: "done"
    })
}

self.addEventListener('message', function (e) {
    try {
        performScan(self, e.data.buffer, e.data.bytes, e.data.mask, e.data.start, e.data.end)
    } catch (err) {
        self.postMessage({
            type: "error",
            error: err
        })
    }
}, false)