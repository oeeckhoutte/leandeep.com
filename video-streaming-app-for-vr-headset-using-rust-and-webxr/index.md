# Video streaming app for VR headset using rust and webxr

- Canonical URL: https://leandeep.com/video-streaming-app-for-vr-headset-using-rust-and-webxr/
- Author: Olivier Eeckhoutte
- Published: 2026-02-15T21:19:00Z
- Updated: 2026-02-15T21:19:00Z
- Language: fr
- Tags: Rust, WebXR, Featured
- License: CC BY-NC 4.0 (https://creativecommons.org/licenses/by-nc/4.0/)



I have a lot of 360° videos recorded with a 360 camera, and I wanted to be able to stream them from my laptop. I’ve been wanting to experiment with VR app development for a long time, so I built an app using Rust as the backend server and WebXR for the UI. 

The learning curve between WebXR and Unity is much lower for a former frontend developer. I developed PWA apps for about 10 years, from 2009 to 2019, so it was pretty easy for me to pick it up. Having recently built the UI of a social network in React, transitioning to WebXR was seamless. Compared to Unity, the difference is night and day. I gave Unity a shot with no prior experience, and honestly, getting started was tough. Moreover I'm not a big fan of C#.

In short, I needed an application that would let me stream dozens of 20 to 50 GB 360° videos stored on an external hard drive. So I built one.

I used Rust with Axum as the backend server and WebXR for the UI. The UI performance is surprisingly solid. I honestly expected videos over 50 GB to lag, but they don't. Not at all. With a well-built Rust server behind it, it just flies.

I didn't spend time creating a full 3D environment like a virtual cinema room. WebXR is perfectly capable of that, but I gave myself a strict 5-hour timebox to build everything. So I kept it simple and focused on performance and functionality.

I recorded a video while wearing my VR headset. It’s footage captured from inside the headset.

<br/>

Here’s the result:


    <iframe 
        width="100%" 
        height="400px"
        src="//www.youtube.com/embed/Xk1UJVDj1wo?autoplay=1&mute=1" 
        frameborder="0" 
        allow="autoplay; encrypted-media" 
        allowfullscreen>
    </iframe>



<br/>

![image](/images/vr-video-streaming-app.jpg)

<br/>

Here’s the desktop browser version of the interface:

![image](/images/vr-video-streaming-app-on-desktop.png)

This is where WebXR really shines. No app store, no recompilation. Just ship it like any web app. You get instant deployment, iteration speed, and all the advantages of the web ecosystem. And so it is compatible with all VR/AR/XR headsets...

Sure, Unity or Unreal can push performance much further. But for straightforward use cases like streaming and managing videos, WebXR is absolutely sufficient.

<br/>

That wraps up this article. This was just a small project, but it gave me the opportunity to explore WebXR while building something that solved a real personal need.

