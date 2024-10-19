export default async function run(scenes, currentScene, next) {
  // Code de préparation de la scene 3
  //



  // Préparation des boutons de la scene suivante : 
  currentScene.choices.forEach((choice) => {

    const nextButton = document.createElement('button');
    nextButton.innerText = choice.text;

    document.body.append(nextButton);
    nextButton.addEventListener('click', (e)=> {
      next(scenes, choice.nextScene);
    });

  });
}

