import { useState } from 'react'
import { challengeVideos } from '../data/workshop'

function ChallengeVideoGallery() {
  const [selectedId, setSelectedId] = useState(challengeVideos[0].id)
  const selectedVideo =
    challengeVideos.find((video) => video.id === selectedId) ?? challengeVideos[0]

  return (
    <section
      className="challenge-video-gallery"
      aria-labelledby="challenge-video-gallery-title"
      data-testid="challenge-video-gallery"
    >
      <header className="challenge-video-gallery__header">
        <p className="eyebrow">Real-world data</p>
        <h3 id="challenge-video-gallery-title">Training Data Examples</h3>
        <p>
          A glimpse of the real-robot teleoperation and UMI demonstrations
          available to challenge participants.
        </p>
      </header>

      <div className="challenge-video-gallery__layout">
        <article className="challenge-video-feature">
          <video
            aria-label={`${selectedVideo.title} video`}
            controls
            data-format={selectedVideo.format}
            key={selectedVideo.id}
            playsInline
            poster={selectedVideo.poster}
            preload="metadata"
          >
            <source src={selectedVideo.src} type="video/mp4" />
          </video>
          <div
            className="challenge-video-feature__caption"
            data-testid="challenge-video-caption"
          >
            <h4>{selectedVideo.title}</h4>
            <p>
              <span>{selectedVideo.sourceLabel}</span>
              <span>{selectedVideo.durationLabel}</span>
            </p>
          </div>
        </article>

        <div
          className="challenge-video-playlist"
          aria-label="Training data video playlist"
        >
          {challengeVideos.map((video) => {
            const isActive = video.id === selectedVideo.id

            return (
              <button
                aria-label={`${video.title}, ${video.sourceLabel}, ${video.durationLabel}`}
                aria-pressed={isActive}
                key={video.id}
                onClick={() => setSelectedId(video.id)}
                type="button"
              >
                <img alt="" src={video.poster} />
                <span className="challenge-video-playlist__copy">
                  <strong>{video.title}</strong>
                  <small>
                    <span>{video.sourceLabel}</span>
                    <span>{video.durationLabel}</span>
                  </small>
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ChallengeVideoGallery
