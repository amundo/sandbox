var orders = {
  placeOrder: [ 
    'bilabial', 
    'labial-velar', 
    'labial-palatal', 
    'labiodental', 
    'dental', 
    'alveolar', 
    'alveolo-palatal', 
    'postalveolar', 
    'retroflex', 
    'palatal', 
    'velar', 
    'uvular', 
    'pharyngeal', 
    'epiglottal', 
    'glottal'
  ],
  mannerOrder: [ 
    'plosive', 
    'double articulations', 
    'nasal', 
    'trill', 
    'tap', 
    'lateral flap', 
    'fricative', 
    'lateral fricative', 
    'affricate', 
    'lateral affricate', 
    'approximant', 
    'lateral approximant' 
  ],
  glottalStateOrder: [ 
    'voiceless', 
    'voiced', 
    'voiceless aspirated', 
    'voiced aspirated', 
    'click', 
    'implosve', 
    'ejective', 
    'breathy', 
    'creaky'
  ]
}

function renamePhone(phone){
  phone.oldName = phone.name;
  phone.name = phone.voicing + ' ' + phone.place + ' ' + phone.manner;
}

ipa.forEach(function(phone){
  renamePhone(phone);
})

missingManners = []

ipa.filter(function(phone){
  if(!(orders.mannerOrder.indexOf(phone.manner) > -1)) {
    if(!(missingManners.indexOf(phone.manner) > -1)) {
      missingManners.push(phone.manner);
    }
  } 
})

missingPlaces = []

ipa.filter(function(phone){
  if(!(orders.placeOrder.indexOf(phone.place) > -1)) {
    if(!(missingPlaces.indexOf(phone.place) > -1)) {
      missingPlaces.push(phone.place);
    }
  } 
})

missingGlottalStates = []

ipa.filter(function(phone){
  if(!(orders.glottalStateOrder.indexOf(phone.voicing) > -1)) {
    if(!(missingGlottalStates.indexOf(phone.voicing) > -1)) {
      missingGlottalStates.push(phone.voicing);
    }
  } 
})

// missingManners
// Array [ "aspirated plosive", "ejective", "ejective fricative", "implosive", "labialized plosive", "flap", "Aspirated affricate", "Ejective affricate", "Aspirate affricate", "aspirated approximant" ]
// missingPlaces
// Array [ "palato-alveolar", "Alveo-palatal", "Labio-velar", "lateral", "labialized palatal", "labiovelar" ]

ipa.forEach(function(phone){
  if(phone.place == 'palato-alveolar' || phone.place == 'Alveo-palatal'){
    phone.place = 'alveolo-palatal'
  }
  if(phone.place == 'Labio-velar' || phone.place == 'labiovelar'){
    phone.place = 'labial-velar'
  }
  
})