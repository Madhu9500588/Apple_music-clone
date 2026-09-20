const songs = [
  {
    title: "I Thought I saw Your Face Today",
    artist: "SHE & HIM",
    cover: "Covers/She&Him.jpg",
    src: "Music/I Thought I Saw Your Face Today.mp3",
  },

  {
    title: "Kun Faaya Kun",
    artist: "A.R. Rahman, Javed Ali, Mohit Chauhan",
    cover: "Covers/Rockstar.jpg",
    src: "Music/Kun Faaya Kun.mp3",
  },

  {
    title: "Pesamale",
    artist: "Siri Xander",
    cover: "Covers/pesamale.jpg",
    src: "Music/Pesamale.mp3",
  },

  {
    title: "Ranjha",
    artist: "Jasleen Royal",
    cover: "Covers/ranjha-shershaah-500-500.jpg",
    src: "Music/Ranjha.mp3",
  },

  {
    title: "Rathinamo(Male)",
    artist: "Saurav Srisan",
    cover: "Covers/rathinamo-indie-tamil-2026 (1).jpg",
    src: "Music/Rathinamo.mp3",
  },

  {
    title: "Rathinamo(Female)",
    artist: "Tanisha Gnanavel",
    cover: "Covers/rathinamo-indie-tamil-2026 (1).jpg",
    src: "Music/Rathinamo(female).mp3",
  },

  {
    title: "Un Per Solla",
    artist: "Sujatha Mohan",
    cover: "Covers/unpersolla.jpg",
    src: "Music/Un Per Solla.mp3",
  },
];

const audio = document.getElementById("audio");

const songGrid = document.getElementById("songGrid");
const likedGrid = document.getElementById("likedGrid");
const playlistBox = document.getElementById("playlistBox");
const createPlaylistBtn = document.getElementById("createPlaylistBtn");

const playerTitle = document.getElementById("playerTitle");
const playerArtist = document.getElementById("playerArtist");
const playerArt = document.getElementById("playerArt");

const playBtn = document.getElementById("playBtn");
const progress = document.getElementById("progress");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const volume = document.getElementById("volume");
const likeBtn = document.getElementById("likeBtn");
const searchInput = document.getElementById("searchInput");

// ==============================
// USER NAME
// ==============================

const nameModal = document.getElementById("nameModal");
const nameInput = document.getElementById("nameInput");
const saveNameBtn = document.getElementById("saveNameBtn");

const userName = document.getElementById("userName");
const userAvatar = document.getElementById("userAvatar");
const accountInitial = document.getElementById("accountInitial");

const changeNameBtn = document.getElementById("changeNameBtn");

let savedName = localStorage.getItem("musicUserName") || "";

// ==============================
// USER NAME FUNCTIONS
// ==============================

function updateUserName(name) {
  userName.textContent = name;

  const initial = name.charAt(0).toUpperCase();

  userAvatar.textContent = initial;
  accountInitial.textContent = initial;
}

function openNameModal() {
  nameModal.classList.remove("hidden");

  nameInput.value = savedName;

  setTimeout(() => {
    nameInput.focus();
  }, 100);
}

function closeNameModal() {
  nameModal.classList.add("hidden");
}

// ==============================
// SAVE NAME
// ==============================

saveNameBtn.addEventListener("click", () => {
  const name = nameInput.value.trim();

  if (name === "") {
    alert("Please enter your name.");
    return;
  }

  savedName = name;

  localStorage.setItem("musicUserName", savedName);

  updateUserName(savedName);

  closeNameModal();
});

// ==============================
// CHANGE NAME
// ==============================

changeNameBtn.addEventListener("click", () => {
  openNameModal();
});
let currentIndex = -1;

let liked = JSON.parse(localStorage.getItem("likedSongs") || "[]");
let playlists = JSON.parse(localStorage.getItem("musicPlaylists") || "[]");

// ==============================
// RENDER SONG CARDS
// ==============================

function renderSongs(list = songs, target = songGrid) {
  target.innerHTML = list
    .map(
      (song) => `
        <article
          class="song-card"
          data-index="${songs.indexOf(song)}"
        >

          <img
            class="song-cover"
            src="${song.cover}"
            alt="${song.title}"
          >

          <h4>
            ${song.title}
          </h4>

          <p>
            ${song.artist}
          </p>

          <button
            class="add-playlist-btn"
            data-index="${songs.indexOf(song)}"
          >
            + Add to Playlist
          </button>

        </article>
      `,
    )
    .join("");

  // ==========================
  // SONG CARD CLICK
  // ==========================

  target.querySelectorAll(".song-card").forEach((card) => {
    card.addEventListener("click", () => {
      playSong(Number(card.dataset.index));
    });
  });

  // ==============================
  // ADD SONG TO PLAYLIST
  // ==============================

  function addSongToPlaylist(songIndex) {
    if (playlists.length === 0) {
      alert("You don't have any playlists yet.\n\nCreate a playlist first.");

      return;
    }

    const song = songs[songIndex];

    // Create a numbered list of playlists

    let message = "Choose a playlist:\n\n";

    playlists.forEach((playlist, index) => {
      message += `${index + 1}. ${playlist.name}\n`;
    });

    message += "\nEnter the playlist number:";

    const choice = prompt(message);

    if (choice === null) {
      return;
    }

    const playlistIndex = Number(choice) - 1;

    // Check whether number is valid

    if (
      playlistIndex < 0 ||
      playlistIndex >= playlists.length ||
      !Number.isInteger(playlistIndex)
    ) {
      alert("Invalid playlist number.");

      return;
    }

    const playlist = playlists[playlistIndex];

    // Check if song already exists

    if (playlist.songs.includes(song.id)) {
      alert(`"${song.title}" is already in "${playlist.name}".`);

      return;
    }

    // Add song

    playlist.songs.push(song.id);

    // Save

    localStorage.setItem("musicPlaylists", JSON.stringify(playlists));

    alert(`"${song.title}" added to "${playlist.name}"!`);

    // Refresh playlist display

    renderPlaylist();
  }

  // ==========================
  // ADD TO PLAYLIST BUTTON
  // ==========================

  target.querySelectorAll(".add-playlist-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      // Don't play the song when button is clicked
      event.stopPropagation();

      const songIndex = Number(button.dataset.index);

      addSongToPlaylist(songIndex);
    });
  });
}
// ==============================
// RENDER LIKED SONGS
// ==============================

function renderLiked() {
  const likedSongs = songs.filter((_, i) => liked.includes(i));

  if (likedSongs.length === 0) {
    likedGrid.innerHTML = `
      <div style="color:#91a0bd;font-size:12px;padding:20px 0">
        No liked songs yet. Click ♡ while a song is playing.
      </div>
    `;

    return;
  }

  renderSongs(likedSongs, likedGrid);
}

// ==============================
// RENDER PLAYLISTS
// ==============================

function renderPlaylist() {
  if (playlists.length === 0) {
    playlistBox.innerHTML = `
      <div class="empty-playlist">

        <strong>No playlists yet</strong>

        Click <b>+ Create Playlist</b>
        to create your first playlist.

      </div>
    `;

    return;
  }

  playlistBox.innerHTML = playlists
    .map(
      (playlist) => `
        <div
          class="playlist-card"
          data-playlist-id="${playlist.id}"
        >

          <div class="playlist-icon">
            ♪
          </div>

          <div class="playlist-info">

            <strong>
              ${playlist.name}
            </strong>

            <small>
              ${playlist.songs.length}
              ${playlist.songs.length === 1 ? "song" : "songs"}
            </small>

          </div>

          <div class="playlist-actions">

            <button
              class="playlist-action-btn delete"
              data-delete-id="${playlist.id}"
            >
              Delete
            </button>

          </div>

        </div>
      `,
    )
    .join("");

  // ==========================
  // OPEN PLAYLIST
  // ==========================

  playlistBox.querySelectorAll(".playlist-card").forEach((card) => {
    card.addEventListener("click", () => {
      const playlistId = card.dataset.playlistId;

      openPlaylist(playlistId);
    });
  });
  // ==========================
  // DELETE PLAYLIST
  // ==========================

  playlistBox.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const playlistId = button.dataset.deleteId;

      const playlist = playlists.find((p) => p.id === playlistId);

      if (!playlist) return;

      const confirmDelete = confirm(`Delete "${playlist.name}"?`);

      if (!confirmDelete) return;

      playlists = playlists.filter((p) => p.id !== playlistId);

      localStorage.setItem("musicPlaylists", JSON.stringify(playlists));

      renderPlaylist();
    });
  });
}

// ==============================
// OPEN PLAYLIST
// ==============================

function openPlaylist(playlistId) {
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return;

  // Get actual song objects

  const playlistSongs = playlist.songs
    .map((songId) => songs.find((song) => song.id === songId))
    .filter(Boolean);

  playlistBox.innerHTML = `
    
    <div class="playlist-header">

      <div class="playlist-header-left">

        <button
          class="back-playlist-btn"
          id="backPlaylistBtn"
        >
          ← Back
        </button>

        <div>

          <h3>
            ${playlist.name}
          </h3>

          <small
            style="
              color:#9299ad;
              font-size:10px;
            "
          >
            ${playlistSongs.length}
            ${playlistSongs.length === 1 ? "song" : "songs"}
          </small>

        </div>

      </div>

      <button
        class="add-playlist-btn"
        id="addSongsToPlaylistBtn"
      >
        + Add Songs
      </button>

    </div>


    <div id="playlistSongList">

      ${
        playlistSongs.length === 0
          ? `
            <div class="empty-playlist">

              <strong>
                This playlist is empty
              </strong>

              Click <b>+ Add Songs</b>
              to add songs.

            </div>
          `
          : playlistSongs
              .map(
                (song) => `
                
                  <div
                    class="playlist-song-row"
                    data-song-id="${song.id}"
                  >

                    <img
                      class="row-art"
                      src="${song.cover}"
                      alt="${song.title}"
                    >

                    <div class="playlist-song-info">

                      <strong>
                        ${song.title}
                      </strong>

                      <small>
                        ${song.artist}
                      </small>

                    </div>

                    <button
                      class="remove-song-btn"
                      data-song-id="${song.id}"
                    >
                      ✕
                    </button>

                  </div>

                `,
              )
              .join("")
      }

    </div>
  `;

  // ==========================
  // BACK BUTTON
  // ==========================

  document.getElementById("backPlaylistBtn").addEventListener("click", () => {
    renderPlaylist();
  });

  // ==========================
  // ADD SONGS BUTTON
  // ==========================

  document
    .getElementById("addSongsToPlaylistBtn")
    .addEventListener("click", () => {
      chooseSongsForPlaylist(playlist.id);
    });

  // ==========================
  // PLAY SONG
  // ==========================

  playlistBox.querySelectorAll(".playlist-song-row").forEach((row) => {
    row.addEventListener("click", () => {
      const songId = row.dataset.songId;

      const songIndex = songs.findIndex((song) => song.id === songId);

      if (songIndex !== -1) {
        playSong(songIndex);
      }
    });
  });

  // ==========================
  // REMOVE SONG
  // ==========================

  playlistBox.querySelectorAll(".remove-song-btn").forEach((button) => {
    button.addEventListener("click", (event) => {
      event.stopPropagation();

      const songId = button.dataset.songId;

      removeSongFromPlaylist(playlist.id, songId);
    });
  });
}
// ==============================
// REMOVE SONG FROM PLAYLIST
// ==============================

function removeSongFromPlaylist(playlistId, songId) {
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return;

  playlist.songs = playlist.songs.filter((id) => id !== songId);

  localStorage.setItem("musicPlaylists", JSON.stringify(playlists));

  openPlaylist(playlistId);
}

// ==============================
// ADD SONGS TO EXISTING PLAYLIST
// ==============================

function chooseSongsForPlaylist(playlistId) {
  const playlist = playlists.find((p) => p.id === playlistId);

  if (!playlist) return;

  let message = "Choose a song to add:\n\n";

  songs.forEach((song, index) => {
    message += `${index + 1}. ${song.title}\n`;
  });

  message += "\nEnter the song number:";

  const choice = prompt(message);

  if (choice === null) return;

  const songIndex = Number(choice) - 1;

  if (
    !Number.isInteger(songIndex) ||
    songIndex < 0 ||
    songIndex >= songs.length
  ) {
    alert("Invalid song number.");

    return;
  }

  const song = songs[songIndex];

  if (playlist.songs.includes(song.id)) {
    alert(`"${song.title}" is already in this playlist.`);

    return;
  }

  playlist.songs.push(song.id);

  localStorage.setItem("musicPlaylists", JSON.stringify(playlists));

  openPlaylist(playlistId);
}

// ==============================
// CREATE PLAYLIST
// ==============================

createPlaylistBtn.addEventListener("click", () => {
  const playlistName = prompt("Enter your playlist name:");

  if (playlistName === null) {
    return;
  }

  const name = playlistName.trim();

  if (name === "") {
    alert("Please enter a playlist name.");

    return;
  }

  const newPlaylist = {
    id: Date.now().toString(),

    name: name,

    songs: [],
  };

  playlists.push(newPlaylist);

  localStorage.setItem("musicPlaylists", JSON.stringify(playlists));

  renderPlaylist();
});

// ==============================
// PLAY SONG
// ==============================

function playSong(index) {
  currentIndex = index;

  const song = songs[index];

  audio.src = song.src;

  playerTitle.textContent = song.title;

  playerArtist.textContent = song.artist;

  // Show album cover in bottom player
  playerArt.innerHTML = `
    <img
      src="${song.cover}"
      alt="${song.title}"
    >
  `;

  // Update like button
  likeBtn.textContent = liked.includes(index) ? "♥" : "♡";

  likeBtn.classList.toggle("liked", liked.includes(index));

  audio
    .play()
    .then(() => {
      playBtn.textContent = "❚❚";
    })
    .catch(() => {
      playBtn.textContent = "▶";
    });
}

// ==============================
// PLAY / PAUSE
// ==============================

playBtn.addEventListener("click", () => {
  if (currentIndex === -1) {
    playSong(0);

    return;
  }

  if (audio.paused) {
    audio.play();

    playBtn.textContent = "❚❚";
  } else {
    audio.pause();

    playBtn.textContent = "▶";
  }
});

// ==============================
// PREVIOUS SONG
// ==============================

document.getElementById("prevBtn").addEventListener("click", () => {
  if (currentIndex === -1) return;

  playSong((currentIndex - 1 + songs.length) % songs.length);
});

// ==============================
// NEXT SONG
// ==============================

document.getElementById("nextBtn").addEventListener("click", () => {
  if (currentIndex === -1) return;

  playSong((currentIndex + 1) % songs.length);
});

// ==============================
// UPDATE PROGRESS BAR
// ==============================

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  progress.value = (audio.currentTime / audio.duration) * 100;

  currentTime.textContent = formatTime(audio.currentTime);
});

// ==============================
// SHOW SONG DURATION
// ==============================

audio.addEventListener("loadedmetadata", () => {
  duration.textContent = formatTime(audio.duration);
});

// ==============================
// AUTO NEXT SONG
// ==============================

audio.addEventListener("ended", () => {
  playSong((currentIndex + 1) % songs.length);
});

// ==============================
// SEEK BAR
// ==============================

progress.addEventListener("input", () => {
  if (audio.duration) {
    audio.currentTime = (progress.value / 100) * audio.duration;
  }
});

// ==============================
// VOLUME
// ==============================

volume.addEventListener("input", () => {
  audio.volume = Number(volume.value);
});

// ==============================
// LIKE SONG
// ==============================

likeBtn.addEventListener("click", () => {
  if (currentIndex === -1) return;

  if (liked.includes(currentIndex)) {
    liked = liked.filter((i) => i !== currentIndex);
  } else {
    liked.push(currentIndex);
  }

  localStorage.setItem("likedSongs", JSON.stringify(liked));

  likeBtn.textContent = liked.includes(currentIndex) ? "♥" : "♡";

  likeBtn.classList.toggle("liked", liked.includes(currentIndex));

  renderLiked();
});

// ==============================
// SIDEBAR NAVIGATION
// ==============================

document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    switchSection(btn.dataset.section);
  });
});

function switchSection(section) {
  document.querySelectorAll(".nav-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.section === section);
  });

  document
    .getElementById("homeSection")
    .classList.toggle("hidden", section !== "home");

  document
    .getElementById("likedSection")
    .classList.toggle("hidden", section !== "liked");

  document
    .getElementById("playlistSection")
    .classList.toggle("hidden", section !== "playlist");

  if (section === "liked") {
    renderLiked();
  }
}

// ==============================
// FEATURED SONG
// ==============================

document.getElementById("playFeatured").addEventListener("click", () => {
  playSong(0);
});

// ==============================
// SEE ALL
// ==============================

document.getElementById("seeAll").addEventListener("click", () => {
  renderSongs();

  document.getElementById("songGrid").scrollIntoView({
    behavior: "smooth",
  });
});

// ==============================
// ACCOUNT
// ==============================

document.getElementById("accountBtn").addEventListener("click", () => {
  alert("Account: Madhumitha\nPlan: Apple Music Member");
});

// ==============================
// SEARCH
// ==============================

searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase().trim();

  const filtered = songs.filter(
    (song) =>
      song.title.toLowerCase().includes(query) ||
      song.artist.toLowerCase().includes(query),
  );

  renderSongs(filtered);
});

// ==============================
// FORMAT TIME
// ==============================

function formatTime(seconds) {
  if (!Number.isFinite(seconds)) {
    return "0:00";
  }

  const mins = Math.floor(seconds / 60);

  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");

  return `${mins}:${secs}`;
}

// ==============================
// INITIAL SETTINGS
// ==============================

audio.volume = 0.4;

renderSongs();

renderPlaylist();

// ==============================
// ASK NAME ON FIRST VISIT
// ==============================

if (savedName) {
  updateUserName(savedName);
} else {
  openNameModal();
}
