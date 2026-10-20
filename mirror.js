(() => {
  let enabled = true;
  window.addEventListener('speculum:state', (e) => { enabled = e.detail; });

  const patch = (win) => {
    const md = win.navigator.mediaDevices;
    if (!md || md.__speculum) return; // a second patch would flip the image back
    md.__speculum = true;

    const orig = md.getUserMedia.bind(md);
    md.getUserMedia = async (constraints) => {
      const stream = await orig(constraints);
      const [track] = stream.getVideoTracks();
      if (!track) return stream;

      // Use the target window's own constructors so popup tracks stay in their realm.
      const processor = new win.MediaStreamTrackProcessor({ track });
      const generator = new win.MediaStreamTrackGenerator({ kind: 'video' });
      const canvas = new win.OffscreenCanvas(1, 1);
      const ctx = canvas.getContext('2d');

      processor.readable.pipeThrough(new win.TransformStream({
        transform(frame, ctrl) {
          if (!enabled) return ctrl.enqueue(frame);
          canvas.width = frame.displayWidth;
          canvas.height = frame.displayHeight;
          ctx.setTransform(-1, 0, 0, 1, canvas.width, 0); // horizontal flip
          ctx.drawImage(frame, 0, 0);
          ctrl.enqueue(new win.VideoFrame(canvas, { timestamp: frame.timestamp }));
          frame.close();
        }
      })).pipeTo(generator.writable).catch(() => {});

      const stop = generator.stop.bind(generator);
      generator.stop = () => { stop(); track.stop(); }; // release the real webcam
      stream.removeTrack(track);
      stream.addTrack(generator);
      return stream;
    };
  };

  patch(window);

  // Slack huddles run in an about:blank popup driven by the opener; patch it as soon as it exists.
  const open = window.open;
  window.open = function (...args) {
    const win = open.apply(this, args);
    try { if (win) patch(win); } catch {} // cross-origin popups throw on access
    return win;
  };
})();
