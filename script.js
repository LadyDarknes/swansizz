const video = document.getElementById('bgVideo');
const panel = document.getElementById('interactionPanel');
const overlay = document.getElementById('mainOverlay');
const enterText = document.getElementById('enterTxt');

const videos = [
    'video.mp4',
    'video1.mp4',
    'video2.mp4',
    'video3.mp4',
    'video4.mp4'
];

function playRandomVideo() {
    const randomIndex = Math.floor(Math.random() * videos.length);
    video.src = videos[randomIndex];
    video.muted = true; 
    video.load(); 
    video.play().catch(() => {});
}

function updateDiscordProfile() {
    const name = document.getElementById('discordName');
    const act = document.getElementById('discordActivity');
    const avatar = document.getElementById('discordAvatar');
    const status = document.getElementById('discordStatus');
    const spotifyContainer = document.getElementById('spotifyStatusContainer');
    const spotifySong = document.getElementById('spotifySong');
    
    fetch('https://api.lanyard.rest/v1/users/1024685018091622450')
        .then(res => res.json())
        .then(res => {
            if (res.success && res.data) {
                const data = res.data;
                name.textContent = data.discord_user.global_name || data.discord_user.username;
                if (data.discord_user.avatar) {
                    avatar.src = `https://cdn.discordapp.com/avatars/1024685018091622450/${data.discord_user.avatar}.png`;
                } else {
                    avatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                }
                status.className = `status-dot ${data.discord_status}`;
                
                if (data.listening_to_spotify && data.spotify) {
                    spotifyContainer.style.display = 'flex';
                    spotifySong.textContent = 'now listening - ' + data.spotify.song;
                } else {
                    spotifyContainer.style.display = 'none';
                }

                if (data.activities && data.activities.length > 0) {
                    const custom = data.activities.find(a => a.type === 4);
                    const game = data.activities.find(a => a.type === 0);
                    if (custom && custom.state) {
                        act.textContent = custom.state;
                    } else if (game) {
                        act.textContent = `Playing ${game.name}`;
                    } else {
                        act.textContent = data.discord_status;
                    }
                } else {
                    act.textContent = data.discord_status;
                }
            } else {
                name.textContent = 'swansizz';
                act.textContent = 'offline';
                avatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
                status.className = 'status-dot offline';
                spotifyContainer.style.display = 'none';
            }
        })
        .catch(() => {
            name.textContent = 'swansizz';
            act.textContent = 'offline';
            avatar.src = 'https://cdn.discordapp.com/embed/avatars/0.png';
            status.className = 'status-dot offline';
            spotifyContainer.style.display = 'none';
        });
}

window.addEventListener('DOMContentLoaded', () => {
    playRandomVideo();
    updateDiscordProfile();
    setInterval(updateDiscordProfile, 30000);
});

overlay.addEventListener('click', () => {
    video.muted = false;
    video.play().catch(() => {});
    overlay.classList.remove('blurred');
    enterText.classList.add('fade-out');
    setTimeout(() => {
        panel.classList.add('show');
    }, 300);
}, { once: true });

video.addEventListener('ended', () => {
    playRandomVideo();
    video.muted = false;
});
