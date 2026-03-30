function displayImg(path, timeOnScreen = 4000) 
{
  const img = document.createElement("img");
  
  img.src = path;
  img.classList.add("flash-image");

  document.querySelector(".flash-image")?.remove();

  document.body.appendChild(img);

  if (timeOnScreen > 0) 
{
    setTimeout(() => 
    {
      img.style.transition = "opacity 0.5s ease";
      img.style.opacity = "0";
          
      setTimeout(() => img.remove(), 500);
    }, timeOnScreen);
  }
}

/**
 * makes specific html element look glitched out
 * @param {string} elementId
 * @param {number} duration note that 0 makes it run indefinitely
 */
function triggerGlitch(elementId, duration = 0) {
  const el = document.getElementById(elementId);
  if (!el) return;

  // 1. Turn the glitch ON
  el.classList.add("is-glitching");

  // 2. The Janitor Ogre: Turn it OFF after the timer (if a timer was set)
  if (duration > 0) {
    setTimeout(() => {
      el.classList.remove("is-glitching");
    }, duration);
  }
}

function getRandomInt(min, max) 
{
  return Math.floor(Math.random() * (max - min + 1)) + min;
}