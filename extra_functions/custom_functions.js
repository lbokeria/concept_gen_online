// Write a function to create a variable with just the image names, so it can be passed to jsPsychInit for preloading
function only_names(array) {

    var new_array = [];

    for (iName = 0; iName < array.length; iName++){
        new_array[iName] = array[iName].image;
    }

    return new_array;

};

// Define a function that could filter an array by indices
function index_into_array(array,indices){

    var filtered_array = [];

    for(i=0; i<indices.length; i++){
        filtered_array[i] = JSON.parse(JSON.stringify(array[indices[i]]));
        filtered_array[i].trial = i + 1;
    };

    return filtered_array;

};

// A custom shuffle function
function shuffle(array) {
    
    for(let i = array.length - 1; i > 0; i--){

        const j = Math.floor(Math.random() * i);
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;

};

return array;

};

//  Add trial indices to the arrays
function add_image_info_and_trial_session_idxs(array,session_idx,subjOrder,subjSpace) {

    for (iE = 0; iE < array.length; iE++){
        
        if (jatos.studySessionData.show_correct == 1){
          array[iE].image = "./img/" + subjSpace + "/pair_imgs_correct_responses/" + subjOrder + "/" + array[iE].image;
        } else {
          array[iE].image = "./img/" + subjSpace + "/pair_imgs/" + subjOrder + "/" + array[iE].image;
        }
        
        array[iE].trial = iE + 1;
        array[iE].session = session_idx;
        // console.log(array[iE]);
    };

    return array;
};

//  Add trial indices to the arrays
function add_image_info_and_trial_session_idxs_practice_trials(array,session_idx,subjOrder,subjSpace) {

  for (iE = 0; iE < array.length; iE++){
      
      array[iE].image = "./img/" + subjSpace + "/example_imgs/" + array[iE].image;
      array[iE].trial = iE + 1;
      array[iE].session = session_idx;
      // console.log(array[iE]);
  };

  return array;

};    

let trialCreator = function(curr_space_object,baseTrialArray,targetCoordsNames,phase){

    // Shuffle the base trial array
    let baseTrialArrayInner = JSON.parse(JSON.stringify(shuffle(baseTrialArray)))

    // Populate the baseTrialArrayInner with details for each trial
    for(i = 0, j = 0; i < baseTrialArrayInner.length; i++, j+=2) {

      // Randomize item1 and item2
      if (i % 2 == 0){
          [baseTrialArrayInner[i].item1, baseTrialArrayInner[i].item2] = [baseTrialArrayInner[i].item2, baseTrialArrayInner[i].item1]               
      }

      // Which one is the prompt item? If one of them is empty, prompt is the non-empty. Else, determine randomly
      if (baseTrialArrayInner[i].item1.includes('E')){
          baseTrialArrayInner[i].prompt_item_idx = 2
      } else if (baseTrialArrayInner[i].item2.includes('E')){
          baseTrialArrayInner[i].prompt_item_idx = 1
      } else {
          // Choose randomly
          baseTrialArrayInner[i].prompt_item_idx = Math.floor(Math.random()*1) + 1
      }
      if (baseTrialArrayInner[i].prompt_item_idx == 1){
          baseTrialArrayInner[i].foil_item_idx = 2
      } else {
          baseTrialArrayInner[i].foil_item_idx = 1
      }



      // img names and paths for items. Also point names
      baseTrialArrayInner[i].item_img_names  = []
      baseTrialArrayInner[i].item_img_paths  = []
      baseTrialArrayInner[i].item_point_idxs = []

      for (k=0; k<2; k++){
          baseTrialArrayInner[i].item_img_names[k]  = targetCoordsNames.imgNamesUsed['phase_'+iPhase][targetCoordsNames.pointNamesUsed['phase_'+iPhase].indexOf(baseTrialArrayInner[i]['item'+(k+1)])] 
          baseTrialArrayInner[i].item_img_paths[k]  = './img/targets/' + baseTrialArrayInner[i].item_img_names[k] + '.png'
          baseTrialArrayInner[i].item_point_idxs[k] = targetCoordsNames.pointNamesUsed['phase_'+iPhase].indexOf(baseTrialArrayInner[i]['item'+(k+1)])+1
      }

      // point name of the prompt item?
      baseTrialArrayInner[i].prompt_point_name = baseTrialArrayInner[i]["item" + baseTrialArrayInner[i].prompt_item_idx]
      // target name of the prompt item?
      baseTrialArrayInner[i].prompt_img_name = 
          targetCoordsNames.imgNamesUsed['phase_'+iPhase][targetCoordsNames.pointNamesUsed['phase_'+iPhase].indexOf(baseTrialArrayInner[i].prompt_point_name)]
      // prompt img path?
      baseTrialArrayInner[i].prompt_img_path = './img/targets/' + baseTrialArrayInner[i].prompt_img_name + '.png'
      // point name of the foil item?
      baseTrialArrayInner[i].foil_point_name = baseTrialArrayInner[i]["item" + baseTrialArrayInner[i].foil_item_idx]
      // target name of the foil item?
      baseTrialArrayInner[i].foil_img_name = 
          targetCoordsNames.imgNamesUsed['phase_'+iPhase][targetCoordsNames.pointNamesUsed['phase_'+iPhase].indexOf(baseTrialArrayInner[i].foil_point_name)]
      // foil img path?
      baseTrialArrayInner[i].foil_img_path = './img/targets/' + baseTrialArrayInner[i].foil_img_name + '.png'
      // Exemplar img to load?
      baseTrialArrayInner[i].ex_pairs_img_path = './img/' + curr_space_object.concept_space + '/pair_imgs_both_orders/pairs_' + 
              baseTrialArrayInner[i].item_point_idxs[0] + '_' + baseTrialArrayInner[i].item_point_idxs[1] + '.png'            
      // baseTrialArrayInner[i].ex_pairs_img_path = './img/' + curr_space_object.concept_space + '/pair_imgs_both_orders/pairs_16_16.png'                
    }

    // Shuffle once again, otherwise prompt item location is predictable 
    baseTrialArrayInner = JSON.parse(JSON.stringify(shuffle(baseTrialArrayInner)))

    return baseTrialArrayInner
  }; // function trialCreator
