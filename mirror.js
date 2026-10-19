(() => {
  let enabled = true;
  window.addEventListener('speculum:state', (e) => { enabled = !!e.detail; });
  window.dispatchEvent(new CustomEvent('speculum:request'));

  const md = navigator.mediaDevices;
  const orig = md.getUserMedia.bind(md);
  md.getUserMedia = async (constraints) => {
    const stream = await orig(constraints);
    const [track] = stream.getVideoTracks();
    if (!track) return stream;

    const processor = new MediaStreamTrackProcessor({ track });
    const generator = new MediaStreamTrackGenerator({ kind: 'video' });
    const canvas = new OffscreenCanvas(1, 1);
    const ctx = canvas.getContext('2d');

    processor.readable.pipeThrough(new TransformStream({
      transform(frame, ctrl) {
        if (!enabled) { ctrl.enqueue(frame); return; } // pass through untouched
        const w = frame.displayWidth, h = frame.displayHeight;
        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;
        ctx.setTransform(-1, 0, 0, 1, w, 0); // horizontal flip
        ctx.drawImage(frame, 0, 0, w, h);
        const out = new VideoFrame(canvas, { timestamp: frame.timestamp });
        frame.close();
        ctrl.enqueue(out);
      }
    })).pipeTo(generator.writable).catch(() => {});

    const stop = generator.stop.bind(generator);
    generator.stop = () => { stop(); track.stop(); }; // release real webcam
    stream.removeTrack(track);
    stream.addTrack(generator);
    return stream;
  };
})();
