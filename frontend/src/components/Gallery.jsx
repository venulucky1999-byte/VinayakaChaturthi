import { useState } from "react";
import { X, Maximize2 } from "lucide-react";

function Gallery({ user }) {
  const [selectedImage, setSelectedImage] = useState(null);

  const photos = [
    {
      id: 1,
      title: "Ganesh Decoration",
      image: "/gallery/ganesh1.jpg",
    },
    {
      id: 2,
      title: "Ganesh Idol 2015",
      image: "/gallery/ganesh2015 .jpg",
    },
    {
      id: 3,
      title: "Festival Celebration 2017",
      image: "/gallery/ganesh2017.jpg",
    },
    {
      id: 4,
      title: "Pooja Ceremony 2018",
      image: "/gallery/ganesh2018.jpg",
    },
    {
      id: 5,
      title: "Festival Decorations 2019",
      image: "/gallery/ganesh2019.jpg",
    },
    {
      id: 6,
      title: "Ganesh Chaturthi 2022",
      image: "/gallery/ganesh2022 (1).jpg",
    },
    {
      id: 7,
      title: "Community Celebration 2022",
      image: "/gallery/ganesh2022 (2).jpg",
    },
    {
      id: 8,
      title: "Evening Celebration 2023",
      image: "/gallery/ganesh2023.jpg",
    },
    {
      id: 9,
      title: "Pooja 2024",
      image: "/gallery/ganesh2024.jpg",
    },
    {
      id: 10,
      title: "Ganapathi Bappa Morya 2025",
      image: "/gallery/ganesh2025.jpg",
    },
  ];

  return (
    <div className="gallery-page">
      {/* HEADER */}

      <div className="gallery-header">
        <div>
          <p className="page-label">FESTIVAL MEMORIES</p>

          <h1>Photo Gallery</h1>

          <p className="page-description">
            Beautiful memories from our Vinayaka Chaturthi celebrations
          </p>
        </div>
      </div>

      {/* GALLERY */}

      <div className="gallery-grid">
        {photos.map((photo) => (
          <div
            className="gallery-card"
            key={photo.id}
            onClick={() => setSelectedImage(photo)}
          >
            <div className="gallery-image-container">
              <img
                src={photo.image}
                alt={photo.title}
                className="gallery-image"
              />

              <div className="gallery-overlay">
                <Maximize2 size={24} />

                <span>View Photo</span>
              </div>
            </div>

            <div className="gallery-card-info">
              <h3>{photo.title}</h3>

              <span>Vinayaka Chaturthi</span>
            </div>
          </div>
        ))}
      </div>

      {/* FULL SCREEN IMAGE */}

      {selectedImage && (
        <div className="gallery-modal" onClick={() => setSelectedImage(null)}>
          <button
            className="gallery-close"
            onClick={() => setSelectedImage(null)}
          >
            <X size={26} />
          </button>

          <img
            src={selectedImage.image}
            alt={selectedImage.title}
            onClick={(e) => e.stopPropagation()}
          />

          <div className="gallery-modal-title">{selectedImage.title}</div>
        </div>
      )}
    </div>
  );
}

export default Gallery;
