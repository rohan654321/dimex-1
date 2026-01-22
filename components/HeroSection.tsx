'use client'

import { useState, useRef, useEffect } from 'react'
import {
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  PlayIcon,
  PauseIcon
} from '@heroicons/react/24/outline'

declare global {
  interface Window {
    YT: any
    onYouTubeIframeAPIReady: () => void
  }
}

export default function HeroSection() {
  const VIDEO_ID = 'wJcae3DLXc0'
  const [isMuted, setIsMuted] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const playerRef = useRef<any>(null)
  const playerContainerRef = useRef<HTMLDivElement>(null)

  // Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script')
      tag.src = 'https://www.youtube.com/iframe_api'
      const firstScriptTag = document.getElementsByTagName('script')[0]
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)
    }

    window.onYouTubeIframeAPIReady = initializePlayer

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy()
      }
    }
  }, [])

  const initializePlayer = () => {
    if (playerRef.current || !window.YT || !playerContainerRef.current) return

    playerRef.current = new window.YT.Player('youtube-player', {
      videoId: VIDEO_ID,
      width: '100%',
      height: '100%',
      playerVars: {
        autoplay: 1,
        mute: 1,
        controls: 0,
        loop: 1,
        playlist: VIDEO_ID,
        modestbranding: 1,
        rel: 0,
        playsinline: 1,
        fs: 0,
        disablekb: 1,
      },
      events: {
        onReady: () => {
          console.log('Player ready')
        },
        onStateChange: (event: any) => {
          if (event.data === window.YT.PlayerState.PLAYING) {
            setIsPlaying(true)
          } else if (event.data === window.YT.PlayerState.PAUSED) {
            setIsPlaying(false)
          }
        },
      },
    })
  }

  const handlePlayPause = () => {
    if (!playerRef.current) return

    if (isPlaying) {
      playerRef.current.pauseVideo()
    } else {
      playerRef.current.playVideo()
    }
  }

  const handleMute = () => {
    if (!playerRef.current) return

    if (isMuted) {
      playerRef.current.unMute()
    } else {
      playerRef.current.mute()
    }
    setIsMuted(!isMuted)
  }

  return (
    <section
      id="heroSection"
      className="relative min-h-screen overflow-hidden text-white"
    >
      {/* BACKGROUND VIDEO */}
      <div className="absolute inset-0 z-[-2] overflow-hidden bg-black">
        <div 
          ref={playerContainerRef}
          id="youtube-player"
          className="absolute left-1/2 top-1/2 h-[120%] w-[120%] -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        />
        
        {/* Fallback image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg)`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: isPlaying ? 0 : 1,
            transition: 'opacity 0.3s ease'
          }}
        />
      </div>

      {/* DARK OVERLAY */}
      <div className="absolute inset-0 z-[-1] bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

      {/* CONTENT - Same as above */}
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1240px] lg:max-w-[1320px] xl:max-w-[1440px] 2xl:max-w-[1600px]">
          <div className="relative z-20 flex min-h-screen flex-col justify-end gap-5 pb-16">
            
            {/* CONTROLS */}
            <div className="relative z-30 mb-6 flex gap-3">
              <button
                onClick={handlePlayPause}
                className="rounded-full bg-black/60 p-3 backdrop-blur transition hover:bg-black/80"
              >
                {isPlaying ? (
                  <PauseIcon className="h-6 w-6" />
                ) : (
                  <PlayIcon className="h-6 w-6" />
                )}
              </button>

              <button
                onClick={handleMute}
                className="rounded-full bg-black/60 p-3 backdrop-blur transition hover:bg-black/80"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="h-6 w-6" />
                ) : (
                  <SpeakerWaveIcon className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* MAIN HEADING */}
            <h1 className="mt-32 text-[70px] font-bold leading-[0.85] tracking-tight sm:text-[100px] md:text-[120px] lg:mt-0 lg:text-[150px] xl:text-[170px]">
              DIEMEX <span className="text-[#82C6EB]">2026</span>
            </h1>

            {/* CONTENT */}
            <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end">
              <div className="lg:max-w-5xl">
                <h2 className="mb-3 text-2xl font-bold leading-snug sm:text-3xl">
                  Where global die & mould leaders meet India's manufacturers.
                </h2>

                <ul className="space-y-2 text-base leading-snug sm:text-lg">
                  <li className="flex items-start gap-2">
                    <span className="mt-[2px] text-[#33A8DF]">•</span>
                    <span>
                      3rd Edition of the International Exhibition for Die & Mould, Tooling, and Precision Manufacturing Technologies
                    </span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 shrink-0 lg:ml-auto lg:mt-0">
                <a href="/exhibiting-enquiry">
                  <button className="rounded-full bg-[#33A8DF] px-12 py-4 text-lg font-semibold text-white transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-[#33A8DF]/40">
                    Book Your Stand
                  </button>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}