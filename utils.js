function displayImg(path, timeOnScreen = 1000) 
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