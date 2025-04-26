// Sound effects
export const sounds = {
    hover: { src: '/sounds/1.wav' },
    click: { src: '/sounds/1.wav' },
    letter: { src: '/sounds/letter.wav' },
    success: { src: '/sounds/1.wav' },
    intro: { src: '/sounds/intro1.mp3' } // Add background music
};
  
// Initialize audio objects
export const initSounds = () => {
  Object.keys(sounds).forEach(key => {
    sounds[key].audio = new Audio(sounds[key].src);
    sounds[key].audio.volume = 0.3;
    
    // Set background music to loop
    if (key === 'intro') {
      sounds[key].audio.loop = true;
      sounds[key].audio.volume = 0.3; // Lower volume for BGM
    }
    
    sounds[key].audio.load();
  });
};