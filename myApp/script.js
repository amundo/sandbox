// GLOBAL VARIABLES
var corporaDetailModule = document.getElementById('corporaDetailModule');
var corporaOverviewModule = document.getElementById('corporaOverviewModule');
var detailPaneHeader = document.getElementById('detailPaneHeader');
var documentsDetailModule = document.getElementById('documentsDetailModule');
var documentsOverviewModule = document.getElementById('documentsOverviewModule');
var dynamicPopup = document.getElementById('dynamicPopup');
var dynamicPopupContentArea = document.getElementById('dynamicPopupContentArea');
var graphemesList = document.getElementById('graphemesList');
var lexiconDetailModule = document.getElementById('lexiconDetailModule');
var lexiconList = document.getElementById('lexiconList');
var lexiconOverviewModule = document.getElementById('lexiconOverviewModule');
var mediaDetailModule = document.getElementById('mediaDetailModule');
var mediaOverviewModule = document.getElementById('mediaOverviewModule');
var orthographiesDropdown = document.getElementById('orthographiesDropdown');
var orthographyLanguageBox = document.getElementById('orthographyLanguageBox');
var orthographyNameBox = document.getElementById('orthographyNameBox');
var overviewPaneNav = document.getElementById('overviewPaneNav');
var statisticsButton = document.getElementById('statisticsButton');
var statisticsPopup = document.getElementById('statisticsPopup');
var tagsDetailModule = document.getElementById('tagsDetailModule');
var tagsOverviewModule = document.getElementById('tagsOverviewModule');
var textsDetailModule = document.getElementById('textsDetailModule');
var textsOverviewModule = document.getElementById('textsOverviewModule');

// CONSTRUCTORS
	function Character(characterString, shortcut) {
		var decimalPoints = [];
		var hexadecimalPoints = [];

		charPoints = characterString.split("");
		charPoints.forEach(function(charPoint) {
			decimalPoints.push(charPoint.charCodeAt());
		});
		
		decimalPoints.forEach(function(decimalPoint) {
			hexadecimalPoints.push(decimalPoint.toString(16));
		});
		
		var charID = "0x" + hexadecimalPoints.join("0x"); // Storing this as a variable makes it accessible to the deletion function below
		this.characterID = charID;
		this.characterString = characterString;
		this.shortcut = shortcut;
		
		// Checks to see whether the character already exists in database.preferences, and deletes it if so
		database.preferences.characterPaletteList.forEach(function(paletteChar) {
			if (charID === paletteChar.characterID) {
				database.preferences.characterPaletteList.splice(database.preferences.characterPaletteList.indexOf(paletteChar), 1);
				loadCharacterPalette();
			}
		});

		database.preferences.characterPaletteList.push(this);
	};
	function Corpus(language, name) {
		// Primary fields
		this.name = name;
		
		// Joined fields
		this.language = language;
		this.tags = [];
		this.texts = []; // Array of indexes in the texts array
		database.corpora.push(this);
	};	
	function Database() {
		this.corpora = [];
		this.delimiters = []; // Eventually delimiters will need to be a property of a writing system
		this.lexica = [];
		this.orthographies = [];
		this.tags = [];
		this.texts = [];
		this.preferences = {
			currentDisplayState: [1, 1, 1],
			characterPaletteList: [],
			currentCorpus: "",
			currentModule: "",
			currentOrthographyIndex: "",
			characterPaletteDisplay: "flex"
		};
	};
	function Grapheme() {
		this.graph = "";
		this.ipa = "";
	};
	function LexEntry(definition, gloss, lemma, morphemeType, POS) {
		this.allomorphs = [];
		this.definition = definition;
		this.gloss = gloss;
		this.lemma = lemma;
		this.morphemeType = morphemeType;
		this.POS = POS;
	};
	function Lexicon(language) {
		this.language = language;
		
		this.lexEntries = [];
		this.morphemeTypes = [];
		this.partsOfSpeech = [];
		
		database.lexica.push(this);
	};
	function MorphemeType(typeName) {
		this.typeName = typeName;
		this.leadingToken = "";
		this.trailingToken = "";
	};
	function Orthography() {
		this.characterSet = [];
		this.graphemes = [];
		this.language = "";
		this.name = "";
	};
	function Phrase(transcription, translation, paragraphNum) {
		// Primary fields
		this.paragraphNum = paragraphNum;
		this.transcription = transcription;
		this.translation = translation;
		
		this.tags = [];
		this.words = [];
		tokenizePhrase(this);
	};
	function Project() {
		this.corpus = {};
		this.lexica = [];
		this.tags = [];
	};
	function Tag(category, values) {
		this.category = category;
		this.values = [];
		
		database.tags.push(this);
	};
	function Text(abbreviation, access, dateRecorded, title, type) {
		// Primary fields
		this.abbreviation = abbreviation;
		this.access = access;
		this.dateCreated = Date();
		this.dateModified = undefined;
		this.dateRecorded = dateRecorded;
		this.title = title;
		this.type = type; // Monologue, dialogue, or elicitation
		
		this.phrases = [];
		this.tags = [];
		this.notes = [];
		
		// Joined fields
		this.activityID = null;
		this.cityID = null;
		this.countryID = null;
		this.genreID = null;
		this.GISLocationID = null;
		this.localeID = null;
		this.regionID = null;
	};
	function Word(gloss, token) {
		this.gloss = gloss;
		this.tags = [];
		this.token = token;
		this.morphemes = [];
	};

// FUNCTIONS
	function addCharacterToPalette(character) {
		var characterGallery = document.getElementById('characterGallery');
		var charButton = document.createElement('button');
		
		charButton.id = "char" + character.characterID;
		charButton.type = "button";
		charButton.innerHTML = character.characterString;
		charButton.grapheme = character.characterString;
		charButton.name = "Shortcut: " + character.shortcut;
		charButton.className = "tooltip charButton";
		characterGallery.appendChild(charButton);
		
		Mousetrap.bindGlobal(character.shortcut, function(event) {
			if (event.preventDefault) {
				event.preventDefault();
			}
			
			if (document.activeElement.className.indexOf("characterInput") !== -1) {				
				var textBox = document.activeElement;
				// This method still leaves a few possible ways for people to be stuck with extra characters in their text box, but since these are unlikely to be used I'm not writing code to account for it
				var regex = new RegExp(/(shift)|(ctrl)|(alt)|(option)|(meta)|(command)|(backspace)|(tab)|(enter)|(return)|(capslock)|(esc)|(escape)|(space)|(pageup)|(pagedown)|(end)|(home)|(left)|(up)|(right)|(down)|(ins)|(del)|\+| /g);
				shortcutString = character.shortcut.replace(regex, "");
				var textValue;
				if (textBox.tagName === "DIV") {
					textValue = textBox.textContent;
				} else if (textBox.tagName === "INPUT") {
					textValue = textBox.value
				}
				var clippedShortcutString = shortcutString.substring(0, shortcutString.length-1);
				var newString = textValue.replace(clippedShortcutString, "");
				var finalString = newString + character.characterString;
				if (textBox.tagName === "DIV") {
					textBox.textContent = finalString;
					var range = document.createRange();
					range.selectNodeContents(textBox);
					range.collapse(false);
					selection = window.getSelection();
					selection.removeAllRanges();
					selection.addRange(range);
				} else if (textBox.tagName === "INPUT") {
					textBox.value = finalString;
				}
			}
		});
	};
	function addDocument() {
		function filePrompt() {
			var promptText = document.createElement('p');
			promptText.textContent = "Choose a PDF document to upload.";
			dynamicPopupContentArea.appendChild(promptText);
			
			var filePrompt = document.createElement('input');
			filePrompt.id = "newDocumentFilePrompt";
			filePrompt.type = "file";
			dynamicPopupContentArea.appendChild(filePrompt);
			
			var uploadButton = document.createElement('button');
			uploadButton.id = "newDocumentUploadButton";
			uploadButton.type = "button";
			uploadButton.textContent = "Upload";
			dynamicPopupContentArea.appendChild(uploadButton);
			
			uploadButton.addEventListener('click', uploadDocument);
		};
		function uploadDocument() {
			var file = document.getElementById('newDocumentFilePrompt').files[0];
			console.log(file);
			alert("Write the function that adds the file to your database. In the meantime, just add the PDF to the Documents folder and rename it manually.");
		};
		
		resetDynamicPopup();
		filePrompt();
		display(dynamicPopup);
	};
	function addGrapheme() {
		var newGrapheme = new Grapheme();
		var orthography = database.orthographies[database.preferences.currentOrthographyIndex];
		orthography.graphemes.push(newGrapheme);
		displayOrthography(database.preferences.currentOrthographyIndex);
	};
	function addPhrase(textIndex, phraseIndexToInsertAt, transcription, translation) {
		if (typeof transcription === "undefined") {
			transcription = "";
		}
		if (typeof translation === "undefined") {
			translation = "";
		}
		var newPhrase = new Phrase(transcription, translation);
		database.texts[textIndex].phrases.splice(Number(phraseIndexToInsertAt)+1, 0, newPhrase);
	};
	function addOrthography() {
		var newOrthography = new Orthography();
		newOrthography.language = database.preferences.currentCorpus;
		database.orthographies.push(newOrthography);
		displayOrthographiesList();
		displayOrthography(database.orthographies.length-1);
	};
	function addTag(tagCategory, tagValue, textIndex, phraseIndex, wordIndex) {
		function matchesCategory(tag) {
			if (tag.category === tagCategory) {
				return true;
			} else {
				return false;
			}
		};
		function matchesValue(value) {
			if (value === tagValue) {
				return true;
			} else {
				return false;
			}
		};
		function hasValueMatch(tag) {
			if (tag.values.some(matchesValue)) {
				return true;
			} else {
				return false;
			}
		};
		
		if (database.tags.some(matchesCategory)) {
			if (database.tags.some(hasValueMatch) === false) {
				database.tags.forEach(function(tag) {
					if (tag.category === tagCategory) {
						tag.values.push(tagValue);
					}
				});
			}
		} else {
			var valuesArray = [];
			valuesArray.push(tagValue);
			new Tag(tagCategory, valuesArray);
		}
		
		var dataTag = {
			category: tagCategory,
			value: tagValue
		};
		
		if (typeof textIndex !== "undefined") {
			if (typeof phraseIndex === "undefined") {
				database.texts[textIndex].tags.push(dataTag);
			} else if (typeof wordIndex === "undefined") {
				database.texts[textIndex].phrases[phraseIndex].tags.push(dataTag);
			} else {
				database.texts[textIndex].phrases[phraseIndex].words[wordIndex].tags.push(dataTag);
			}
		}
	};
	function closePopup(event) {
		hide(event.target.parentNode);
	};
	function concordanceSearch(searchUnit, searchDomain, searchTier, searchItem) {
		hits = [];
		instanceNum = 0;
		var searchTerm = new RegExp(searchItem, "g");

		function searchInDomain(searchDomainObject, t, p, w, m) {
			var searchText;
			switch (searchTier) {
				case "textTranscription":
					searchText = "";
					searchDomainObject.phrases.forEach(function(phrase, p) {
						searchText = searchText.concat(" ", phrase.transcription);
					});
					searchText = searchText.trim();
					break;
				case "textTranslation":
					searchText = "";
					searchDomainObject.phrases.forEach(function(phrase, p) {
						searchText = searchText.concat(" ", phrase.translation);
					});
					searchText = searchText.trim();
					break;
				case "transcription":
					searchText = searchDomainObject.transcription;
					break;
				case "translation":
					searchText = searchDomainObject.translation;
					break;
				case "wordToken":
					searchText = searchDomainObject.token;
					break;
				case "wordGloss":
					searchText = searchDomainObject.gloss;
					break;
				case "morphemeToken":
					searchText = searchDomainObject.lemma;
					break;
				case "morphemeGloss":
					searchText = searchDomainObject.gloss;
					break;
				default:
			}
			
			if (searchText.search(searchTerm) !== -1) {
				var hit = {};
				hit.searchUnit = searchUnit;
				hit.searchDomain = searchDomain;
				hit.searchTier = searchTier;
				hit.searchUnitBreadcrumb = getBreadcrumb(searchUnit, t, p, w, m);
				hit.searchDomainBreadcrumb = getBreadcrumb(searchDomain, t, p, w, m);
				hit.textIndex = t;
				hit.phraseIndex = p;
				hit.wordIndex = w;
				hit.morphemeIndex = m;
				
				if (hits.length > 0) {
					hits.forEach(function(oldHit) {
						if (hit.searchUnitBreadcrumb === oldHit.searchUnitBreadcrumb) {
							hit.searchUnitBreadcrumb = hit.searchUnitBreadcrumb + "instance" + instanceNum;
							instanceNum += 1;
						}
					});
				}
				
				if (document.getElementById('selectedAction').value === "searchWithinItemsAction") {
					var selectedHits = [];
					
					previousSearchHits.forEach(function(previousHit, i) {
						if (document.getElementById("searchResultCheckbox" + i).checked === true) {
							selectedHits.push(previousHit);
						}
					});
					
					selectedHits.forEach(function(selectedHit) {
						if (hit.searchUnitBreadcrumb === selectedHit.searchUnitBreadcrumb) {
							hits.push(hit);
						}
					});
				} else {
					hits.push(hit);
				}
			}
		};

		var searchDomainNum = 0;
		
		switch (searchDomain) {
			case "text":
				searchDomainNum = 1;
				break;
			case "phrase":
				searchDomainNum = 2;
				break;
			case "word":
				searchDomainNum = 3;
				break;
			case "morpheme":
				searchDomainNum = 4;
				break;
			default:
		}
		
		if (searchDomainNum > 0) {
			database.texts.forEach(function(text, t) {
				if (searchDomainNum > 1) {
					text.phrases.forEach(function(phrase, p) {
						if (searchDomainNum > 2) {
							phrase.words.forEach(function(word, w) {
								if (searchDomainNum > 3) {
									word.morphemes.forEach(function(morpheme, m) {
										searchInDomain(morpheme, t, p, w, m);
									});
								} else if (searchDomainNum === 3) {
									searchInDomain(word, t, p, w);
								}
							});
						} else if (searchDomainNum === 2) {
							searchInDomain(phrase, t, p);
						}
					});
				} else if (searchDomainNum === 1) {
					searchInDomain(text, t);
				}
			});
		}
		
		previousSearchHits = hits;
		previousSearch = [searchUnit, searchDomain, searchTier, searchItem];
		displaySearchHits(hits);
		highlightSearchHits(hits, searchTerm);
	};	
	function deleteMorphemes(wordArray, morphemeToDelete) {
		wordArray.forEach(function(word) {
			word.morphemes.forEach(function(morpheme, i) {
				if (database.lexica[0].lexEntries.indexOf(morpheme) === -1) {
					word.morphemes.splice(i, 1);
				}
			});
			while (word.morphemes.indexOf(morphemeToDelete) !== -1) {
				morphemeIndex = word.morphemes.indexOf(morphemeToDelete);
				word.morphemes.splice(morphemeIndex, 1);
			}
		});
	};
	function deletePhrase(textIndex, phraseIndex) {
		database.texts[textIndex].phrases.splice(phraseIndex, 1);
	};
	function deleteDatabaseTag(tagCategory, tagValue) {
		function spliceTags(tagsArray) {
			tagsArray.forEach(function(tag, i) {
				if (tag.category === tagCategory) {
					tag.values.forEach(function(value, j) {
						if (value === tagValue) {
							tag.values.splice(j, 1);
							if (tag.values.length === 0) {
								tagsArray.splice(i, 1);
							}
						}
					});
				}
			});
		}
		
		spliceTags(database.tags);
		database.texts.forEach(function(text) {
			spliceTags(text.tags);
			text.phrases.forEach(function(phrase) {
				spliceTags(phrase.tags);
			});
		});
	};
	function deleteOrthography() {
		database.orthographies.splice(database.preferences.currentOrthographyIndex, 1);
		if (database.orthographies.length === 0) {
			addOrthography();
		}
		database.preferences.currentOrthographyIndex = 0;
		displayOrthographiesList();
		displayOrthography(0);
	};
	function display(element) {
		element.style.display = "flex";
	};
	function displayDocumentsList() {
	};
	function displayGrapheme(grapheme, i) {
		var graphemesList = document.getElementById('graphemesList');
		var graphemesListItemTemplate = document.getElementById('graphemesListItemTemplate');
		var graphemesListItem = graphemesListItemTemplate.content.querySelector('li');
		var graphemeBox = graphemesListItemTemplate.content.querySelector('.graphemeBox');
		var ipaBox = graphemesListItemTemplate.content.querySelector('.ipaBox');
		
		graphemesListItem.id = "graphemeIndex_" + i;
		graphemeBox.value = grapheme.graph;
		ipaBox.value = grapheme.ipa;
		var newGraphemesListItem = graphemesListItemTemplate.content.cloneNode(true);
		graphemesList.appendChild(newGraphemesListItem);
	};
	function displayLexicon() {
		var lexiconListItemTemplate = document.getElementById('lexiconListItemTemplate');
		var lemma = lexiconListItemTemplate.content.querySelector('.lemma');
		var gloss = lexiconListItemTemplate.content.querySelector('.gloss');
		var lexiconListItem = lexiconListItemTemplate.content.querySelector('.lexiconListItem');
		lexiconList.innerHTML = "";
		
		database.lexica[0].lexEntries.forEach(function(lexEntry, i) {
			lexiconListItem.id = i + lexEntry.gloss.replace(" ", "");
			lemma.innerHTML = lexEntry.lemma;
			gloss.innerHTML = lexEntry.gloss;
			var lexiconItem = lexiconListItemTemplate.content.cloneNode(true);
			lexiconList.appendChild(lexiconItem);
			
			document.getElementById(lexiconListItem.id).addEventListener('contextmenu', function(event) {
				event.preventDefault();
				var menu = document.getElementById('rightClickMenu');
				var menuList = document.querySelector('#rightClickMenu ul');
				var searchForMorphemeOption = document.createElement('li');
				
				menuList.innerHTML = "";
				searchForMorphemeOption.innerHTML = "Search for this morpheme";
				menuList.appendChild(searchForMorphemeOption);
				menu.style.left = event.clientX + "px";
				menu.style.transform = "translateX(0)"
				menu.style.top = event.clientY + "px";
				display(menu);
				
				searchForMorphemeOption.addEventListener('click', function(event) {
					searchForMorpheme(lexEntry);			
					hide(menu);
				});
				
				document.body.addEventListener('click', hideMenu);
			});
		});
	};
	function displayMorphemes(textIndex, phraseIndex, wordID, wordIndex) {
		var morphemeTemplate = document.getElementById('morphemeTemplate');
		var morphemeLemma = morphemeTemplate.content.querySelector('.morphemeLemma');
		var morphemeGloss = morphemeTemplate.content.querySelector('.morphemeGloss');
		var morphemeWrapper = morphemeTemplate.content.querySelector('.morpheme');
		var morphemesArea = document.querySelector("#" + wordID + " .morphemesWrapper");
		
		database.texts[textIndex].phrases[phraseIndex].words[wordIndex].morphemes.forEach(function (morpheme, i) {
			morphemeBreadcrumb = wordID + "morpheme" + i;
			morphemeWrapper.id = morphemeBreadcrumb;
			morphemeLemma.innerHTML = morpheme.lemma;
			morphemeGloss.innerHTML = morpheme.gloss;
			var newMorpheme = morphemeTemplate.content.cloneNode(true);
			morphemesArea.appendChild(newMorpheme);
		});
	};
	function displayOrthography(orthographyIndex) {
		var orthography = database.orthographies[orthographyIndex];
		var graphemesList = document.getElementById('graphemesList');
		graphemesList.innerHTML = "";
		orthographyLanguageBox.value = orthography.language;
		orthographyNameBox.value = orthography.name;
		var listHeader = document.createElement('LI');
		var graphsHeader = document.createElement('P');
		var ipaHeader = document.createElement('P');
		var graphsHeaderText = document.createTextNode("Grapheme");
		var ipaHeaderText = document.createTextNode("IPA");
		graphsHeader.appendChild(graphsHeaderText);
		ipaHeader.appendChild(ipaHeaderText);
		listHeader.id = "graphemesListHeader";
		listHeader.appendChild(graphsHeader);
		listHeader.appendChild(ipaHeader);
		graphemesList.appendChild(listHeader);
		
		orthography.graphemes.forEach(displayGrapheme);
		database.preferences.currentOrthographyIndex = orthographyIndex;
};
	function displayOrthographiesList() {
		orthographiesDropdown.innerHTML = "";
		var firstOption = document.createElement('OPTION');
		var firstOptionText = document.createTextNode("Select an orthography...");
		firstOption.appendChild(firstOptionText);
		orthographiesDropdown.add(firstOption);
		database.orthographies.forEach(function(orthography, i) {
			var option = document.createElement('OPTION');
			var text = document.createTextNode(orthography.name);
			option.orthographyIndex = i;
			option.appendChild(text);
			orthographiesDropdown.add(option);
		});
	};
	function displayPhonemeFrequencies() {
		var graph = document.getElementById('statisticsGraphArea');
		var numPhonemes = phonemeFrequencies.length;
		var ns = "http://www.w3.org/2000/svg";
		
		var barWidth = 500/numPhonemes;
		var barGroup = document.createElementNS(ns, 'g');
		var textGroup = document.createElementNS(ns, 'g');
		
		function createFrequencyBar(phoneme, i) {
			if (maxFrequency === 0) {
				var barHeight = 0;
			} else {
				var barHeight = phoneme.frequency/maxFrequency*450;
			}
			
			var rect = document.createElementNS(ns, 'rect');
				rect.setAttribute('height', barHeight);
				rect.setAttribute('width', barWidth);
				rect.setAttribute('x', barWidth*i);
				rect.setAttribute('y', 450-barHeight);
				rect.style.fill = "blue";
			barGroup.appendChild(rect);
		};
		function createTextLabel(phoneme, i) {
			var text = document.createElementNS(ns, 'text');
				text.innerHTML = phoneme.graph;
				text.setAttribute('height', 50);
				text.setAttribute('width', barWidth);
				text.setAttribute('y', 475);
				text.style.fontWeight = "bold";
			textGroup.appendChild(text);
				var textWidth = text.getBBox().width;
				text.setAttribute('x', (barWidth*i)+(barWidth-textWidth)/2);
		};
		
		graph.innerHTML = "";
		phonemeFrequencies.sort(function(a, b) {
			return b.frequency - a.frequency;
		});
		var maxFrequency = phonemeFrequencies[0].frequency;
		graph.appendChild(barGroup);
		graph.appendChild(textGroup);
		phonemeFrequencies.forEach(createFrequencyBar);
		phonemeFrequencies.forEach(createTextLabel);
	};
	function displayPhrase(textIndex, wrapperID, phraseIndex, append) {
		var text = database.texts[textIndex];
		var phrase = text.phrases[phraseIndex];
		var textDisplayArea = document.querySelector("#" + wrapperID);
		var phraseTemplate = document.getElementById('phraseTemplate');
		
		if (append === "replace") {
			textDisplayArea.innerHTML = "";
		}
		
		var breadcrumb = wrapperID.replace(/wrapper/g, "");
		if (breadcrumb === "textsDetailModule") {
			breadcrumb = "text" + textIndex + "phrase" + phraseIndex;
		}
		phraseTemplate.content.querySelector('.phrase').id = breadcrumb;
		var location = phraseTemplate.content.querySelector('.location');
		if (document.querySelector("#textsDetailModule #" + wrapperID) === null) {
			phraseTemplate.content.querySelector('.location').innerHTML = text.abbreviation + " (" + phraseIndex + ")";
			phraseTemplate.content.querySelector('.svgButton:first-child').id = "tagPhrase" + breadcrumb;
		} else {
			location.innerHTML = "";
			location.style.display = "none";
			phraseTemplate.content.querySelector('.svgButton:first-child').id = "tagPhrase" + breadcrumb;
			phraseTemplate.content.querySelector('.svgButton:nth-child(2)').id = "addPhraseAfter" + breadcrumb;
			phraseTemplate.content.querySelector('.svgButton:nth-child(3)').id = "movePhraseUp" + breadcrumb;
			phraseTemplate.content.querySelector('.svgButton:nth-child(4)').id = "movePhraseDown" + breadcrumb;
			phraseTemplate.content.querySelector('.svgButton:nth-child(5)').id = "deletePhrase" + breadcrumb;
		}
		phraseTemplate.content.querySelector('.transcriptionWrapper').innerHTML = phrase.transcription;
		phraseTemplate.content.querySelector('.translationWrapper').innerHTML = "‘" + phrase.translation + "’";
		
		var newPhrase = phraseTemplate.content.cloneNode(true);			
		textDisplayArea.appendChild(newPhrase);
		
		function addPhraseListeners(breadcrumb) {
			if (document.querySelector("#textsDetailModule #" + breadcrumb) !== null) {
				var transcriptionWrapper = document.querySelector("#textsDetailModule #" + breadcrumb + " .transcriptionWrapper");
				var translationWrapper = document.querySelector("#textsDetailModule #" + breadcrumb + " .translationWrapper");
				transcriptionWrapper.id = breadcrumb + "transcription";
				translationWrapper.id = breadcrumb + "translation";
				transcriptionWrapper.contentEditable = true;
				translationWrapper.contentEditable = true;
				
				transcriptionWrapper.addEventListener('input', function(event) {
					var textIndex = event.target.id.match(/[0-9]+/g)[0];
					var phraseIndex = event.target.id.match(/[0-9]+/g)[1];
					database.texts[textIndex].phrases[phraseIndex].transcription = event.target.textContent;
					tokenizePhrase(database.texts[textIndex].phrases[phraseIndex]);
					displayWords(textIndex, breadcrumb, phraseIndex);
				});
				translationWrapper.addEventListener('input', function(event) {
					var textIndex = event.target.id.match(/[0-9]+/g)[0];
					var phraseIndex = event.target.id.match(/[0-9]+/g)[1];
					database.texts[textIndex].phrases[phraseIndex].translation = event.target.textContent;
				});
				transcriptionWrapper.addEventListener('keydown', function(event) {
					if (event.keyCode === 13) {
						event.preventDefault();
						event.target.blur();
					}
				});
				translationWrapper.addEventListener('keydown', function(event) {
					if (event.keyCode === 13) {
						event.preventDefault();
						event.target.blur();
						event.target.textContent = "‘" + event.target.textContent + "’";
					}
				});
				translationWrapper.addEventListener('focus', function(event) {
					event.target.textContent = event.target.textContent.replace(/[‘’]/g, "");
				});
				
				var transcription = document.querySelector("#" + breadcrumb + " .transcription");
				var translation = document.querySelector("#" + breadcrumb + " .translation");
				transcription.addEventListener('click', function(event) {
					var transcriptionWrapper = document.querySelector("#textsDetailModule #" + breadcrumb + " .transcriptionWrapper");
					transcriptionWrapper.focus();
				});
				translation.addEventListener('click', function(event) {
					var translationWrapper = document.querySelector("#textsDetailModule #" + breadcrumb + " .translationWrapper");
					translationWrapper.focus();
				});
				
				var addPhraseAfterButton = document.getElementById("addPhraseAfter" + breadcrumb);
				addPhraseAfterButton.addEventListener('click', function(event) {
					var textIndex = event.target.id.match(/[0-9]+/g)[0];
					var phraseIndex = event.target.id.match(/[0-9]+/g)[1];
					addPhrase(textIndex, phraseIndex);
					displayText(textIndex, "textsDetailModule", "replace");
					var addedPhraseBreadcrumb = "text" + textIndex + "phrase" + (Number(phraseIndex) + 1);
					document.querySelector("#" + addedPhraseBreadcrumb + " .transcriptionWrapper").focus();
					addPhraseListeners(addedPhraseBreadcrumb);
				});
				
				var movePhraseUpButton = document.getElementById("movePhraseUp" + breadcrumb);
				movePhraseUpButton.addEventListener('click', function(event) {
					var textIndex = event.target.id.match(/[0-9]+/g)[0];
					var oldPhraseIndex = event.target.id.match(/[0-9]+/g)[1];
					var newPhraseIndex = Number(oldPhraseIndex) - 1;
					movePhrase(textIndex, oldPhraseIndex, newPhraseIndex);
					displayText(textIndex, "textsDetailModule", "replace");
					var phraseBreadcrumb = "text" + textIndex + "phrase" + newPhraseIndex;
					window.location.hash = phraseBreadcrumb;
				});
				
				var movePhraseDownButton = document.getElementById("movePhraseDown" + breadcrumb);
				movePhraseDownButton.addEventListener('click', function(event) {
					var textIndex = event.target.id.match(/[0-9]+/g)[0];
					var oldPhraseIndex = event.target.id.match(/[0-9]+/g)[1];
					var newPhraseIndex = Number(oldPhraseIndex) + 1;
					movePhrase(textIndex, oldPhraseIndex, newPhraseIndex);
					displayText(textIndex, "textsDetailModule", "replace");
					var phraseBreadcrumb = "text" + textIndex + "phrase" + newPhraseIndex;
					window.location.hash = phraseBreadcrumb;
				});
				
				var deletePhraseButton = document.getElementById("deletePhrase" + breadcrumb);
				deletePhraseButton.addEventListener('click', function(event) {
					var textIndex = event.target.id.match(/[0-9]+/g)[0];
					var phraseIndex = event.target.id.match(/[0-9]+/g)[1];
					deletePhrase(textIndex, phraseIndex);
					displayText(textIndex, "textsDetailModule", "replace");
					var previousPhraseBreadcrumb = "text" + textIndex + "phrase" + (Number(phraseIndex) - 1);
					window.location.hash = previousPhraseBreadcrumb;
				});
			}
			var tagPhraseButton = document.getElementById("tagPhrase" + breadcrumb);
			tagPhraseButton.addEventListener('click', function(event) {
				var textIndex = event.target.id.match(/[0-9]+/g)[0];
				var phraseIndex = event.target.id.match(/[0-9]+/g)[1];
				phraseToTag = [textIndex, phraseIndex];
				display(addTagPopup);
				document.getElementById('tagCategoryPopupBox').focus();
			});
		};
		addPhraseListeners(breadcrumb);
		displayWords(textIndex, breadcrumb, phraseIndex);
	};
	function displaySearchHits(hitsArray) {
		var searchResultsList = document.querySelector('#searchResultsList');
		var searchResultTemplate = document.querySelector('#searchResultTemplate');
		var searchResult = searchResultTemplate.content.querySelector('.searchResult');
		var checkbox = searchResultTemplate.content.querySelector('input');
		var resultWrapper = searchResultTemplate.content.querySelector('.resultWrapper'); // This is also the searchResultArea
		
		hide(searchResultsList);
		searchResultsList.innerHTML = "";
		
		// Adds the search result containing the headers, with an event listener triggering select-all
		searchResult.id = "headerResult";
		resultWrapper.id = "resultWrapperID";
		resultWrapper.htmlFor = "selectAllResults";
		resultWrapper.innerHTML = "Select All";
		
		var newSearchResult = searchResultTemplate.content.cloneNode(true);
		searchResultsList.appendChild(newSearchResult);
		document.getElementById('headerResult').addEventListener('click', function(event) {
			var checkboxes = document.getElementsByName('checkbox');
			if (event.target.checked === true) {
				for (var i = 0, n = checkboxes.length; i<n; i++) {
					checkboxes[i].checked = true;
				}
			} else if (event.target.checked === false) {
				for (var i = 0, n = checkboxes.length; i<n; i++) {
					checkboxes[i].checked = false;
				}
			}
		});
		
		hitsArray.forEach(function(hit, i) {
			searchResult.id = "searchResult" + i;
			resultWrapper.id = hit.searchUnitBreadcrumb + "wrapper";
			checkbox.id = "searchResultCheckbox" + i;
			checkbox.name = "checkbox";
			resultWrapper.innerHTML = "";

			var newSearchResult = searchResultTemplate.content.cloneNode(true);
			searchResultsList.appendChild(newSearchResult);
			
			if (hit.searchUnit === "text") {
				displayText(hit.textIndex, hit.searchUnitBreadcrumb);
			} else if (typeof hit.phraseIndex !== "undefined") {
				displayPhrase(hit.textIndex, resultWrapper.id, hit.phraseIndex);
			}
			
			var viewButton = document.querySelector("#searchResult" + i + " .viewButton");
			viewButton.addEventListener('click', function(event) {
				displayText(hit.textIndex, "textsDetailModule");
				document.getElementById(hit.searchUnitBreadcrumb).style.color = "#E131D8";
				window.location.hash = hit.searchUnitBreadcrumb;
				document.getElementById(hit.searchDomainBreadcrumb).style.fontWeight = "bold";
			});
		});
		
		document.getElementById('resultsCounter').innerHTML = hitsArray.length + " results returned";
		document.getElementById('selectedAction').value = "chooseAction";
		display(document.getElementById('resultsSummary'));
		display(searchResultsList);
	};
	function displayState(overviewPane, detailPane, toolbarPane) {
		var multiplier = 100/(overviewPane + detailPane + toolbarPane);
		document.getElementById('overviewPane').style.maxWidth = overviewPane*multiplier + "%";
		document.getElementById('detailPane').style.maxWidth = detailPane*multiplier + "%";
		document.getElementById('toolbarPane').style.maxWidth = toolbarPane*multiplier + "%";
		
		database.preferences.currentDisplayState = [overviewPane, detailPane, toolbarPane];
		displayStates = database.preferences.currentDisplayState;
		currentMinFlex = (displayStates[0] + displayStates[1] + displayStates[2])/9;
		
		displayStates.forEach(function(flexRatio, i) {
			if (flexRatio === 0) {
				switch (i) {
					case 0:
						document.getElementById('overviewPane').style.display = "none";
						break;
					case 1:
						document.getElementById('detailPane').style.display = "none";
						break;
					case 2:
						document.getElementById('toolbarPane').style.display = "none";
						break;
					default:
				}
			} else {
				switch (i) {
					case 0:
						document.getElementById('overviewPane').style.display = "flex";
						break;
					case 1:
						document.getElementById('detailPane').style.display = "flex";
						break;
					case 2:
						document.getElementById('toolbarPane').style.display = "flex";
						break;
					default:
						
				}
			}
		});
		
		if (displayStates[0] === 0) {
			document.getElementById('textsList').innerHTML = "";
			document.getElementById('corpusList').selectedIndex = 0;
			document.getElementById('lexiconList').innerHTML = "";
			document.getElementById('tagsList').innerHTML = "";
		} else if (displayStates[1] === 0) {
			document.getElementById('textsDetailModule').innerHTML = "";
		} else if (displayStates[2] === 0) {
			document.getElementById('searchResultsList').innerHTML = "";
		}
	};
	function displayTagsList() {
		var tagsList = document.getElementById('tagsList');
		tagsList.innerHTML = "";
		database.tags.forEach(function(tag) {
			var tagCategory = tag.category;
			var tagValues = tag.values;

			tagValues.forEach(function(value) {
				var tagsListItem = document.createElement('li');
				tagID = tag.category.replace(" ", "") + ":" + value.replace(" ","");
				tagsListItem.id = tagID;
				tagsListItem.innerHTML = tag.category + ": " + value;
				tagsList.appendChild(tagsListItem);
			});
		});
	};
	function displayText(textIndex, textWrapperID, append) {
		var textTemplate = document.getElementById('textTemplate');
		var textWrapper = document.getElementById(textWrapperID);
		hide(textWrapper);
		
		if (append === "replace") {
			textWrapper.innerHTML = "";
		}

		var breadcrumb = textWrapperID + "wrapper";
		var text = database.texts[textIndex];
		textTemplate.content.querySelector('.textBody').id = breadcrumb;
		textTemplate.content.querySelector('.textTitle').innerHTML = "(" + text.abbreviation + ") " + text.title;
		var newText = textTemplate.content.cloneNode(true);
		textWrapper.appendChild(newText);
		
		text.phrases.forEach(function(phrase, i) {
			displayPhrase(textIndex, breadcrumb, i, "append");
		});
		
		display(textWrapper);
	};
	function displayTextsList() {
		var textsList = document.getElementById('textsList');
		var textsListItemTemplate = document.getElementById('textsListItemTemplate');
		
		if (corpusList.value === "") {
			hide(textsList);
		} else {
			display(textsList);
			textsList.innerHTML = "";
			database.corpora.forEach(function(corpus) {
				if (corpus.name = corpusList.value) {
					corpus.texts.forEach(function(textIndex) {
						text = database.texts[textIndex]
						textsListItemTemplate.content.querySelector('a').innerHTML = text.abbreviation + " " + text.title;
						textsListItemTemplate.content.querySelector('a').id = "textsIndex" + textIndex;
						textsListItemTemplate.content.querySelector('a').href = "#detailPaneHeader";
						var textListItem = textsListItemTemplate.content.cloneNode(true);
						textsList.appendChild(textListItem);
						
						document.getElementById("textsIndex" + textIndex).addEventListener('click', function(event) {
							displayText(textIndex, "textsDetailModule", "replace");
						});
					});
				}
			});
		}
		
		database.preferences.currentCorpus = corpusList.value;
	};
	function displayWords(textIndex, phraseID, phraseIndex) {
		var wordsArea = document.querySelector("#" + phraseID + " .wordsWrapper");
		var wordTemplate = document.querySelector('#wordTemplate');
		wordsArea.innerHTML = "";
		
		text = database.texts[textIndex];
		text.phrases[phraseIndex].words.forEach(function(word, j) {
			breadcrumb = "text" + textIndex + "phrase" + phraseIndex + "word" + j;
			wordTemplate.content.querySelector('.word').id = breadcrumb;
			wordTemplate.content.querySelector('.token').innerHTML = word.token;
			wordTemplate.content.querySelector('.gloss').innerHTML = word.gloss;
			var newWord = wordTemplate.content.cloneNode(true);
			wordsArea.appendChild(newWord);
			
			displayMorphemes(textIndex, phraseIndex, breadcrumb, j);
		});
	};
	function exportData(content, format, textsToExport) {
		var exportWindow = window.open("", "_blank");
		var exportBody = exportWindow.document.body;
		exportBody.style.display = "none";
		
		function exportToSFM(textsToExport) {
			function newline(linetext) {
				var textnode = document.createTextNode(linetext);
				exportBody.appendChild(textnode);
				exportBody.appendChild(document.createElement('br'));
			};
			
			function exportTextToSFM(textToExport) {
				newline("\\text");
				newline("\\title " + textToExport.title);
				newline("\\abb " + textToExport.abbreviation);
				
				textToExport.phrases.forEach(function(phrase, i) {
					if (i === 0 || (i > 0 && (phrase.paragraphNum !== textToExport.phrases[i-1].paragraphNum))) {
						newline("\\p");
					}
					
					newline("\\lx " + phrase.transcription);
					newline("\\tx " + phrase.translation);
				});
			};
			
			if (textsToExport) {
				textsToExport.forEach(function(textToExport) {
					exportTextToSFM(database.texts[textToExport]);
				});
			} else {
				database.texts.forEach(exportTextToSFM);
			}
		};
		
		function exportToJSON(textsToExport) {
			if (textsToExport) {
				textsToExport.forEach(function(textToExport) {
					var p = document.createElement('p');
					p.innerHTML = "<pre>" + JSON.stringify(database.texts[textToExport], null, 2) + "</pre>";
					exportBody.appendChild(p);
				});
			} else {
				exportBody.innerHTML = "<pre>" + JSON.stringify(database.texts, null, 2) + "</pre>";
			}
		};
		
		function exportDatabase() {
			exportBody.innerHTML = "<pre>" + JSON.stringify(database, null, 2) + "</pre>";
		}
		
		if (content === "texts" && format === "sfm") {
			exportToSFM(textsToExport);
		} else if (content === "corpus" && format === "sfm") {
			exportToSFM();
		} else if (content === "texts" && format === "json") {
			exportToJSON(textsToExport);
		} else if (content === "database") {
			exportDatabase();
		} else {
			exportToJSON();
		}
		
		exportBody.style.display = "block";
	}
	function exportStatisticalData() {
		var exportWindow = window.open("", "_blank");
		var exportBody = exportWindow.document.body;
		
		switch (database.preferences.statistic) {
			case "phonemeFrequencies":
				phonemeFrequencies.forEach(function(phoneme) {
					var text = document.createTextNode('"' + phoneme.graph + '","' + phoneme.ipa + '",' + phoneme.frequency);
					exportBody.appendChild(text);
					exportBody.appendChild(document.createElement('br'));
				});
				break;
			default:
				notify(notificationPopup, "No data to export.");
		}
	};
	function getPhonemeFrequencies() {
		var string = "";
		function createPhoneme(grapheme) {
			var phonemeFrequency = {
				graph: grapheme.graph,
				ipa: grapheme.ipa,
				frequency: 0
			};
			return phonemeFrequency;
		};
		function calculatePhonemeFrequencies() {
			database.texts.forEach(function(text) {
				text.phrases.forEach(function(phrase) {
					phrase.words.forEach(function(word) {
						string = word.token;
						phonemeFrequencies.forEach(incrementFrequency);
					});
				});
			});
		};
		function incrementFrequency(phoneme) {
			var regexp = new RegExp(phoneme.graph, "g");
			if (string.search(regexp) !== -1) {
				var matches = string.match(regexp);
				phoneme.frequency += matches.length;
				string = string.replace(regexp, "");
			}
		};
		
		phonemeFrequencies = database.orthographies[database.preferences.currentOrthographyIndex].graphemes.map(createPhoneme);
		phonemeFrequencies.sort(function(a, b) {
			return b.graph.length - a.graph.length;
		});
		calculatePhonemeFrequencies();
		database.preferences.statistic = "phonemeFrequencies";
	};
	function getBreadcrumb(searchLevel, t, p, w, m) {
		switch (searchLevel) {
			case "text":
				breadcrumb = "text" + t;
				break;
			case "phrase":
				breadcrumb = "text" + t + "phrase" + p;
				break;
			case "word":
				breadcrumb = "text" + t + "phrase" + p + "word" + w;
				break;
			case "morpheme":
				breadcrumb = "text" + t + "phrase" + p + "word" + w + "morpheme" + m;
				break;
			default:
		}
		return breadcrumb;
	};
	function hide(element) {
		element.style.display = "none";
	};
	function hideMenu() {
		var menu = document.getElementById('rightClickMenu');
		hide(menu);
		menu.style.transform = "translateX(-100%)";
		document.querySelector('#rightClickMenu ul').innerHTML = "";
	};
	function highlightSearchHits(hitsArray, searchTerm) {
		hitsArray.forEach(function(hit) {
			if (hit.searchUnit !== "text") {
				document.getElementById(hit.searchDomainBreadcrumb).style.color = "#E131D8";
			}
		});
	};
	function loadCharacterPalette() {
		document.getElementById('characterGallery').innerHTML = "";
		document.getElementById('characterBox').value = "";
		document.getElementById('shortcutBox').value = "";
		database.preferences.characterPaletteList.forEach(addCharacterToPalette);
	};
	function loadEnvironment() {		
		// Loads the IndexedDB
		var request = window.indexedDB.open("HTLXBackups");
		request.onupgradeneeded = function(event) {
			var webDatabase = request.result;
			
			// If no database is found, create a 'backups' object store, and prompt the user for a new database
			if (!webDatabase.objectStoreNames.contains("backups")) {
				webDatabase.createObjectStore("backups");
			}
		};
		request.onsuccess = function(event) {
			webDatabase = request.result;
			
			// Loads the database from IndexedDB
			var transaction = webDatabase.transaction(["backups"], "readwrite");
			var objectStore = transaction.objectStore("backups");
			var returnedWebDatabase = objectStore.get(1);
			returnedWebDatabase.onsuccess = function(event) {
				database = event.target.result;
				if (typeof database === "undefined") {
					// Prompts user for a new database if the database is undefined
					document.getElementById('newDatabasePopup').style.display = "flex";
				} else {
					// Sets the display state
					displayState(database.preferences.currentDisplayState[0], database.preferences.currentDisplayState[1], database.preferences.currentDisplayState[2]);
					
					// Populates the dropdown list of corpora and displays textList
					var corpusList = document.getElementById('corpusList');
					var optionListItemTemplate = document.querySelector('#optionListItemTemplate');
					optionListItemTemplate.content.querySelector('option').innerHTML = "";
					optionListItemTemplate.content.querySelector('option').value = "";
					optionListItemTemplate.content.querySelector('option').id = "corpusListNoSelection";
					var noSelectionItem = optionListItemTemplate.content.cloneNode(true);
					corpusList.appendChild(noSelectionItem);
							
					database.corpora.forEach(function(corpus) {
						var templateListItem = optionListItemTemplate.content.querySelector('option');
						templateListItem.innerHTML = corpus.name;
						templateListItem.value = corpus.name;
						templateListItem.id = "corpusList" + corpus.name;
						
						var corpusListItem = optionListItemTemplate.content.cloneNode(true);
						corpusList.appendChild(corpusListItem);
					});
					
					document.getElementById('corpusList').value = database.preferences.currentCorpus;
					displayTextsList();
					
					displayOrthography(database.preferences.currentOrthographyIndex);
					
					setModule(database.preferences.currentModule);
							
					loadCharacterPalette();
					Mousetrap.bindGlobal('ctrl+s', function(event) {
						if (event.preventDefault) {
							event.preventDefault();
						}
						saveEnvironment();
					});
							
					// Changes the display property of the character palette based on its last state
					document.getElementById('characterPalette').style.display = database.preferences.characterPaletteDisplay;
					
					// Sets the delimiters in the delimiters list from local storage
					if (typeof database === "object") {
						document.getElementById('delimiterListBox').value = database.delimiters.join("");
					}
				}
			};
		};
		request.onerror = function(event) {
			console.log("Error: " + event.errorCode);
		};
	};
	function movePhrase (textIndex, oldPhraseIndex, newPhraseIndex) {
		// The newPhraseIndex refers to the phrase index that you want to insert at *AFTER* the original has been spliced (so the array is one shorter)
		// So the newPhraseIndex will always be 1 off from where you want it in the original array
		splicedPhrase = database.texts[textIndex].phrases.splice(oldPhraseIndex, 1);
		database.texts[textIndex].phrases.splice(newPhraseIndex, 0, splicedPhrase[0]);
	};
	function notify(element, content) {
		if (typeof content !== "undefined") {
			element.innerHTML = content;
		}
		
		element.style.display = "flex";
		element.style.opacity = 1;
		element.style.transition = "opacity 3s";
		element.style.zIndex = 100;
		setTimeout(function() {element.style.opacity = 0}, 1000);
		setTimeout(function() {element.style.display = "none"}, 4000);
	};
	function resetDynamicPopup() {
		dynamicPopupContentArea.innerHTML = "";
	};
	function saveEnvironment() {
		var transaction = webDatabase.transaction(["backups"], "readwrite");
		var objectStore = transaction.objectStore("backups");
		var request = objectStore.put(database, 1);
		request.onsuccess = function(event) {
			notificationContent = "Your data has been saved.";
			notify(notificationPopup, notificationContent);
		};
	}
	function searchForLexEntryByLemma(searchText) {
		var searchExpression = new RegExp(searchText, "g");
		var matchedLexEntry;
		database.lexica[0].lexEntries.forEach(function(lexEntry) {
			if (lexEntry.lemma.search(searchExpression) !== -1) {
				matchedLexEntry = lexEntry;
			}
		});
		return matchedLexEntry;
	};
	function searchForMorpheme(lexEntryObject) {
		hits = [];
		database.texts.forEach(function(text, t) {
			text.phrases.forEach(function(phrase, p) {
				phrase.words.forEach(function(word, w) {
					if (word.morphemes.indexOf(lexEntryObject) !== -1) {
						var hit = {};
						hit.searchUnit = "morpheme";
						hit.searchDomain = "morpheme";
						hit.searchTier = "morphemeToken";
						hit.searchUnitBreadcrumb = getBreadcrumb("morpheme", t, p, w, word.morphemes.indexOf(lexEntryObject));
						hit.searchDomainBreadcrumb = getBreadcrumb("morpheme", t, p, w, word.morphemes.indexOf(lexEntryObject));
						hit.textIndex = t;
						hit.phraseIndex = p;
						hit.wordIndex = w;
						hit.morphemeIndex = word.morphemes.indexOf(lexEntryObject);

						if (hits.length > 0) {
							hits.forEach(function(oldHit) {
								if (hit.searchUnitBreadcrumb === oldHit.searchUnitBreadcrumb) {
									hit.searchUnitBreadcrumb = hit.searchUnitBreadcrumb + "instance" + instanceNum;
									instanceNum += 1;
								}
							});
						}
						
						hits.push(hit);
					};
				});
			});
		});
		
		previousSearchHits = hits;
		displaySearchHits(hits);
		highlightSearchHits(hits, lexEntryObject.lemma);
	};
	function searchForPhraseTag (databaseTagCategory, databaseTagValue) {
		hits = [];
		database.texts.forEach(function(text, t) {
			text.phrases.forEach(function(phrase, p) {
				phrase.tags.forEach(function(tag, tagIndex) {
					if (tag.category === databaseTagCategory) {
						if (tag.value === databaseTagValue) {
							var hit = {};
							hit.searchUnit = "phrase";
							hit.searchDomain = "phrase";
							hit.searchTier = "";
							hit.searchUnitBreadcrumb = getBreadcrumb("phrase", t, p);
							hit.searchDomainBreadcrumb = getBreadcrumb("phrase", t, p);
							hit.textIndex = t;
							hit.phraseIndex = p;
							hit.wordIndex = "";
							hit.morphemeIndex = "";
							hits.push(hit);
						}
					}
				});
			});
		});
	};
	function setModule(module) {
		var modules = [
			corporaOverviewModule,
			corporaDetailModule,
			documentsDetailModule,
			documentsOverviewModule,
			lexiconDetailModule,
			lexiconOverviewModule,
			mediaOverviewModule,
			mediaDetailModule,
			orthographiesOverviewModule,
			orthographiesDetailModule,
			tagsDetailModule,
			tagsOverviewModule,
			textsDetailModule,
			textsOverviewModule
		];

		function setNavButtons() {
			var navButtons = document.querySelector('#overviewPaneNav ul').children;
			for (var i=0; i<navButtons.length; i++) {
				navButtons[i].className = "";
			}
			document.getElementById(module + "Nav").className = "navSelected";
		};
		
		setNavButtons();
		modules.forEach(hide);
		
		switch (module) {
			case "corpora":
				detailPaneHeader.innerHTML = "Corpus";
				break;
			case "documents":
				detailPaneHeader.innerHTML = "Document";
				displayDocumentsList();
				break;
			case "lexicon":
				detailPaneHeader.innerHTML = "Lexical Entry";
				displayLexicon();
				break;
			case "media":
				detailPaneHeader.innerHTML = "Media File";
				break;
			case "orthographies":
				detailPaneHeader.innerHTML = "Orthography";
				displayOrthographiesList();
				break;
			case "tags":
				detailPaneHeader.innerHTML = "Tag";
				displayTagsList();
				break;
			case "texts":
				detailPaneHeader.innerHTML = "Text";
				displayTextsList();
				break;
			default:
				detailPaneHeader.innerHTML = "Details";
		}
		
		display(document.getElementById(module + "DetailModule"));
		display(document.getElementById(module + "OverviewModule"));
		database.preferences.currentModule = module;
	};
	function countPhrases() {
		var phraseCount = 0;
		database.texts.forEach(function(text) {
			text.phrases.forEach(function(phrase) {
				phraseCount += 1;
			});
		});
		return phraseCount;
	};
	function sortLexicon() {
		database.lexica[0].lexEntries.sort(function(a, b) {
			if (typeof a.lemma === "undefined") {
				a.lemma = "";
			}
			if (typeof b.lemma === "undefined") {
				b.lemma = "";
			}
			if (a.lemma < b.lemma) {
				return -1;
			} else if (a.lemma > b.lemma) {
				return 1;
			} else {
				return 0;
			}
		});
	};
	function tokenizePhrase(phrase) {
		phrase.words = [];
		var delimiters = new RegExp("[" + database.delimiters.join("") + "]+");
		var tokens = phrase.transcription.split(delimiters);
		
		tokens.forEach(function(token, i) {
			if (token === "") {
				tokens.splice(i, 1);
			} else {
				var word = new Word("", tokens[i]);
				phrase.words.push(word);
			}
		});
	};
	function updateGrapheme(event) {
		var orthography = database.orthographies[database.preferences.currentOrthographyIndex];
		var grapheme = orthography.graphemes[event.target.parentNode.id.split("_")[1]];
		grapheme.graph = document.querySelector("#" + event.target.parentNode.id + " .graphemeBox").value;
		grapheme.ipa = document.querySelector("#" + event.target.parentNode.id + " .ipaBox").value;
	};
	function updateOrthography() {
		orthography = database.orthographies[database.preferences.currentOrthographyIndex];
		orthography.language = orthographyLanguageBox.value;
		orthography.name = orthographyNameBox.value;
	};
	
// EVENTS	
	document.body.addEventListener('click', function(event) {
		if (event.target.className === "closeIcon") {
			closePopup(event);
		}
	});
	document.getElementById('addCharacterButton').addEventListener('click', function(event) {
		event.preventDefault();
		var characterBox = document.getElementById('characterBox');
		var shortcutBox = document.getElementById('shortcutBox');
		
		if (typeof characterBox.value === "string") {
			var character = new Character(characterBox.value, shortcutBox.value);
			addCharacterToPalette(character);
		}
		
		characterBox.value = "";
		shortcutBox.value = "";
		hide(document.getElementById('shortcutsPopup'));
	});
	document.getElementById('addDocumentButton').addEventListener('click', addDocument);
	document.getElementById('addGraphemeButton').addEventListener('click', addGrapheme);
	document.getElementById('addMorphemeToLexiconButton').addEventListener('click', function(event) {
		document.getElementById('detailPaneHeader').innerHTML = "Lexeme";
		document.getElementById('lexiconDetailModule').reset();
		document.getElementById('lexiconDetailModule').style.display = "flex";
		document.getElementById('lemmaBox').focus();
		sortLexicon();
		newLexEntry = new LexEntry();
		database.lexica[0].lexEntries.push(newLexEntry);

		currentLexEntry = newLexEntry;
		if (database.preferences.currentDisplayState[1] === 0) {
			displayState(database.preferences.currentDisplayState[0], currentMinFlex, database.preferences.currentDisplayState[2]);
		}
	});
	document.getElementById('addNewLexEntryButton').addEventListener('click', function(event) {
		event.preventDefault();
		currentLexEntry = new LexEntry();
		database.lexica[0].lexEntries.push(currentLexEntry);
		sortLexicon();
		document.getElementById('lexiconDetailModule').reset();
	});
	document.getElementById('addOrthographyButton').addEventListener('click', addOrthography);
	document.getElementById('addTagPopup').addEventListener('submit', function(event) {
		event.preventDefault();
		var tagCategory = document.getElementById('tagCategoryPopupBox').value;
		var tagValue = document.getElementById('tagValuePopupBox').value;
		
		var textIndex = phraseToTag[0];
		var phraseIndex = phraseToTag[1];
		
		addTag(tagCategory, tagValue, textIndex, phraseIndex);
		hide(addTagPopup);
	});	
	document.getElementById('advancedSearchToolsSummary').addEventListener('click', function(event) {
		var details = document.getElementById('advancedSearchToolsDetails');
		var searchUnitPhrase = document.getElementById('searchUnitTypePhrases');
		var searchDomainPhrase = document.getElementById('searchDomainTypePhrases');
		var searchTierTranscription = document.getElementById('phraseTranscriptionTier');
		if (details.style.display === "flex") {
			hide(details);
		} else {
			display(details);
		}
		searchUnitPhrase.checked = true;
		searchDomainPhrase.checked = true;
		searchTierTranscription.checked = true;
	});
	document.getElementById('characterBox').addEventListener('focus', function(event) {
		Mousetrap.bindGlobal('u', function(event) {
			event.target.addEventListener('keyup', function(event) {
				var regex = new RegExp(/u[0-9|a-z|A-z]{4}$/);
				if (regex.test(event.target.value)) {
					var oldString = event.target.value.match(regex);
					var xString = oldString[0].replace(/u(0)+/, "");
					var newString = String.fromCharCode("0x" + xString);
					event.target.value = event.target.value.replace(oldString, newString);
				}
			});
		});
		lastFocusedInputBox = event.target;
	})
	document.getElementById('characterPaletteButton').addEventListener('click', function(event) {
		if (document.getElementById('characterPalette').style.display === "flex") {
			hide(document.getElementById('characterPalette'));
			database.preferences.characterPaletteDisplay = "none";
		} else {
			display(document.getElementById('characterPalette'));
			database.preferences.characterPaletteDisplay = "flex";
		}
	});
	document.getElementById('characterGallery').addEventListener('click', function(event) {
		lastFocusedInputBox.value = lastFocusedInputBox.value.substring(0, lastFocusedInputBox.selectionStart) + event.target.grapheme + lastFocusedInputBox.value.substring(lastFocusedInputBox.selectionEnd);
	});
	document.getElementById('characterGallery').addEventListener('contextmenu', function(event) {
		event.preventDefault();
		var characterGallery = event.currentTarget;
		var buttonClicked = event.target;
		var menu = document.getElementById('rightClickMenu');
		var menuList = document.querySelector('#rightClickMenu ul');
		var deleteOption = document.createElement('li');
		
		buttonClicked.className = "charButton";
		menuList.innerHTML = "";
		deleteOption.innerHTML = "Delete";
		menuList.appendChild(deleteOption);
		menu.style.left = event.pageX + "px";
		menu.style.top = event.pageY + "px";
		display(menu);
		
		deleteOption.addEventListener('click', function(event) {
			database.preferences.characterPaletteList.forEach(function(character) {
				if (("char" + character.characterID) === buttonClicked.id) {
					database.preferences.characterPaletteList.splice(database.preferences.characterPaletteList.indexOf(character), 1);
					characterGallery.removeChild(buttonClicked);
				}
			});			
			hide(menu);
		});
		
		document.body.addEventListener('click', hideMenu);
	});
	document.getElementById('closeCharacterPalette').addEventListener('click', function(event) {
		hide(document.getElementById('characterPalette'));
	});
	document.getElementById('closeFilePopup').addEventListener('click', function(event) {
		hide(filePopup);
	});
	document.getElementById('corpusList').addEventListener('change', displayTextsList);
	document.getElementById('deleteOrthographyButton').addEventListener('click', deleteOrthography);
	document.getElementById('delimiterListBox').addEventListener('change', function(event) {
		database.delimiters = delimiterListBox.value.split("");
	});
	document.getElementById('delimiterListBox').addEventListener('focus', function(event) {
		lastFocusedInputBox = event.target;
	});
	document.getElementById('exportContentOptions').addEventListener('change', function(event) {
		var selectTextsToExport = document.getElementById('selectTextsToExport');
		
		if (event.target.id === "exportCorpus") {
			hide(selectTextsToExport);
			document.getElementById('exportSFM').disabled = false;
		} else if (event.target.id === "exportTexts") {
			document.getElementById('exportSFM').disabled = false;
			
			var selectTextsToExportTemplate = document.querySelector('#selectTextsToExportTemplate');
			var textsToExportList = document.querySelector('#textsToExportList');
			
			if (textsToExportList.innerHTML === "") {
				selectTextsToExportTemplate.content.querySelector('.textTitle').innerHTML = "Title of Text";
				
				var textListItem = selectTextsToExportTemplate.content.cloneNode(true);
				textsToExportList.appendChild(textListItem);
				
				database.texts.forEach(function(text, i) {
					selectTextsToExportTemplate.content.querySelector('.textTitle').innerHTML = text.title;
					selectTextsToExportTemplate.content.querySelector('label').htmlFor = "textListItemCheckbox" + i;
					selectTextsToExportTemplate.content.querySelector('input').id = "textListItemCheckbox" + i;
					
					var textToExportListItem = selectTextsToExportTemplate.content.cloneNode(true);
					textsToExportList.appendChild(textToExportListItem);
				});
			}
			
			display(selectTextsToExport);
		} else if (event.target.id === "exportDatabase") {
			hide(selectTextsToExport);
			document.getElementById('exportJSON').checked = true;
			document.getElementById('exportSFM').disabled = true;
		}
	});
	document.getElementById('exportForm').addEventListener('submit', function(event) {
		event.preventDefault();
		
		var contentRadioButtonNodes = document.getElementsByName('exportContent');
		var formatRadioButtonNodes = document.getElementsByName('exportFormat');
		var textsToExportNodes = document.getElementsByName('textsToExport');
		var textsToExport = [];
		
		for (var i=0; i<contentRadioButtonNodes.length; i++) {
			if (contentRadioButtonNodes[i].checked) {
				content = contentRadioButtonNodes[i].value;
			}
		}
		
		for (var j=0; j<formatRadioButtonNodes.length; j++) {
			if (formatRadioButtonNodes[j].checked) {
				format = formatRadioButtonNodes[j].value;
			}
		}
		
		for (var k=1; k<textsToExportNodes.length; k++) {
			if (textsToExportNodes[k].checked) {
				textsToExport.push(k-1);
			}
		}
		
		if (textsToExport.length === 0 && content === "texts") {
			alert("Please select at least one text to export, or export the entire corpus instead.");
		} else if (content === "texts") {
			exportData(content, format, textsToExport);
		} else {
			exportData(content, format);
		}
	});
	document.getElementById('exportStatisticalDataButton').addEventListener('click', exportStatisticalData);
	document.getElementById('fileSubmitForm').addEventListener('submit', function(event) {
		event.preventDefault();
		var file = document.getElementById('filePrompt').files[0];
		var fileReader = new FileReader();
		fileReader.onload = function(event) {
			var data = event.target.result;
			var contentRadioButtonNodes = document.getElementsByName('importContent');
			var formatRadioButtonNodes = document.getElementsByName('importFormat');
			importObject = JSON.parse(data);
			
			for (var i=0; i<contentRadioButtonNodes.length; i++) {
				if (contentRadioButtonNodes[i].checked) {
					content = contentRadioButtonNodes[i].value;
				}
			}
			for (var j=0; j<formatRadioButtonNodes.length; j++) {
				if (formatRadioButtonNodes[j].checked) {
					format = formatRadioButtonNodes[j].value;
				}
			}
			
			if (content === "corpus") {
				importObject.forEach(function(text) {
					database.texts.push(text);
				});
				notificationContent = "Your corpus of texts has been added to the database.";
				notify(notificationPopup, notificationContent);
			} else if (content === "text") {
				database.texts.push(importObject);
			} else if (content === "database") {
				database = importObject;
				saveEnvironment();
				setTimeout(function() {window.location.reload();}, 4000);
			}
		};
		fileReader.readAsText(file);
		hide(document.getElementById('filePopup'));
	});
	document.getElementById('glossActionPopup').addEventListener('submit', function(event) {
		event.preventDefault();
		
		var newGloss = document.getElementById('glossActionBox').value;
		var replaceGlosses = document.getElementById('replaceGlossesCheckbox').checked;
		var searchTypes = document.getElementsByName('searchType');
		
		for (var i=0; i<searchTypes.length; i++) {
			if (searchTypes[i].checked) {
				searchType = searchTypes[i].value;
			}
		}
		
		if (searchType === "wordToken" || searchType === "wordGloss") {
			var glossesChanged = 0;
			var selectedHits = [];
			
			hits.forEach(function(hit, i) {
				if (document.getElementById("searchResultCheckbox" + i).checked === true) {
					selectedHits.push(hit);
				}
			});
			
			selectedHits.forEach(function(hit) {
				if (replaceGlosses === true) {
					database.texts[hit.textIndex].phrases[hit.phraseIndex].words[hit.wordIndex].gloss = newGloss;
					glossesChanged += 1;
				} else if (replaceGlosses === false) {
					if (database.texts[hit.textIndex].phrases[hit.phraseIndex].words[hit.wordIndex].gloss === "") {
						database.texts[hit.textIndex].phrases[hit.phraseIndex].words[hit.wordIndex].gloss = newGloss;
						glossesChanged += 1;
					}
				}
			});
			document.getElementById('totalItemsGlossed').innerHTML = "Total items glossed: " + glossesChanged;
		}		
	});
	document.getElementById('importForm').addEventListener('submit', function(event) {
		event.preventDefault();
		hide(importExportOptionsPopup);
		var processUploadButton = document.getElementById('processUploadButton');
		processUploadButton.name = "importData";
		hide(processUploadButton);
		display(filePopup);
	});
	document.getElementById('importExportOptionsButton').addEventListener('click', function(event) {
		if (document.getElementById('importExportOptionsPopup').style.display === "flex") {
			hide(document.getElementById('importExportOptionsPopup'));
		} else {
			display(document.getElementById('importExportOptionsPopup'));
		}
		
		document.getElementById('exportCorpus').checked = true;
		document.getElementById('exportJSON').checked = true;
		document.getElementById('exportSFM').disabled = false;
	});
	document.querySelector('#importExportOptionsPopup img.closeIcon').addEventListener('click', function(event) {
		hide(document.getElementById('importExportOptionsPopup'));
	});
	document.getElementById('importExistingDatabaseButton').addEventListener('click', function(event) {
		hide(document.getElementById('newDatabaseButton'));
		hide(event.currentTarget);
		hide(document.querySelector('#newDatabasePopup p:first-child'));
		display(document.querySelector('#newDatabasePopup p:nth-child(2)'));
		display(document.getElementById('databaseFilePrompt'));
		display(document.getElementById('importDatabaseButton'));
	});
	document.getElementById('importDatabaseButton').addEventListener('click', function(event) {
		var file = document.getElementById('databaseFilePrompt').files[0];
		var fileReader = new FileReader();
		fileReader.onload = function(event) {
			database = JSON.parse(event.target.result);
		};
		fileReader.readAsText(file);
		
		hide(document.querySelector('#newDatabasePopup p:nth-child(2)'));
		hide(document.querySelector('#newDatabasePopup div'));
		display(document.querySelector('#newDatabasePopup p:nth-child(3)'));
		notify(document.getElementById('newDatabasePopup'));
		saveEnvironment();
		setTimeout(function() {window.location.reload();}, 4000);
	});
	document.getElementById('lexiconDetailModule').addEventListener('input', function(event) {
		event.preventDefault();
		
		if (typeof currentLexEntry === "undefined") {
			currentLexEntry = new LexEntry();
			database.lexica[0].lexEntries.push(currentLexEntry);
			document.getElementById('lexiconDetailModule').reset();
		}
		
		currentLexEntry.lemma = document.getElementById('lemmaBox').value;
		currentLexEntry.gloss = document.getElementById('glossBox').value;
		currentLexEntry.definition = document.getElementById('definitionBox').value;
		currentLexEntry.POS = document.getElementById('POSBox').value;
		currentLexEntry.morphemeType = document.getElementById('morphemeTypeBox').value;
	});
	document.getElementById('morphemeBox').addEventListener('focus', function(event) {
		morphemeBox.innerHTML = "";
		morphemeBox.focus();
		var optionListItemTemplate = document.getElementById('optionListItemTemplate');
		var option = optionListItemTemplate.content.querySelector('option');
		database.lexica[0].lexEntries.forEach(function(lexEntry, i) {
			if (typeof lexEntry.lemma === "undefined") {
				lexEntry.lemma = "";
			}
			if (typeof lexEntry.gloss === "undefined") {
				lexEntry.gloss = "";
			}
			option.innerHTML = lexEntry.lemma + ": " + lexEntry.gloss;
			var newOption = optionListItemTemplate.content.cloneNode(true);
			morphemeBox.appendChild(newOption);
		});	
	});
	document.getElementById('morphemeAnalysisButton').addEventListener('click', function(event) {
		var morphemeBox = document.getElementById('morphemeBox');
		var morpheme = database.lexica[0].lexEntries[morphemeBox.selectedIndex];
		var selectedHits = [];
		var itemsAnalyzed = 0;
		
		hits.forEach(function(hit, i) {
			if (document.getElementById("searchResultCheckbox" + i).checked === true) {
				selectedHits.push(hit);
			}
		});

		selectedHits.forEach(function(hit) {
			morphemeList = database.texts[hit.textIndex].phrases[hit.phraseIndex].words[hit.wordIndex].morphemes;
			if (morphemeList.indexOf(morpheme) === -1) {
				database.texts[hit.textIndex].phrases[hit.phraseIndex].words[hit.wordIndex].morphemes.push(morpheme);
				itemsAnalyzed += 1;
			}
		});
		
		displaySearchHits(previousSearchHits);
		highlightSearchHits(previousSearchHits);
		document.getElementById('totalItemsAnalyzed').innerHTML = "Total items analyzed: " + itemsAnalyzed;
		saveEnvironment();
	});
	document.getElementById('newDatabaseButton').addEventListener('click', function(event) {
		database = new Database();
		hide(document.getElementById('newDatabasePopup'));
	});
	document.getElementById('orthographySummary').addEventListener('input', updateOrthography);
	document.getElementById('phonemeFrequenciesButton').addEventListener('click', function() {
		getPhonemeFrequencies();
		displayPhonemeFrequencies();
	});
	document.getElementById('removeMorphemeAnalysisButton').addEventListener('click', function(event) {
		var morphemeBox = document.getElementById('morphemeBox');
		var morpheme = database.lexica[0].lexEntries[morphemeBox.selectedIndex];
		var selectedHits = [];
		
		hits.forEach(function(hit, i) {
			if (document.getElementById("searchResultCheckbox" + i).checked === true) {
				selectedHits.push(hit);
			}
		});

		var wordArray = [];
		selectedHits.forEach(function(hit) {
			wordArray.push(database.texts[hit.textIndex].phrases[hit.phraseIndex].words[hit.wordIndex]);
		});
		
		deleteMorphemes(wordArray, morpheme);
		concordanceSearch(lastSearch.searchUnit, lastSearch.searchDomain, lastSearch.searchTier, lastSearch.searchTerm);
	});
	document.getElementById('resetDisplayButton').addEventListener('click', function(event) {
		displayState(1, 1, 1);
		notify(notificationPopup, "Display reset.");
		hide(document.getElementById('settingsPopup'));
	});
	document.getElementById('saveButton').addEventListener('click', function(event) {
		var transaction = webDatabase.transaction(["backups"], "readwrite");
		var objectStore = transaction.objectStore("backups");
		var request = objectStore.put(database, 1);
		request.onsuccess = function(event) {
			notificationContent = "Your work has been saved.";
			notify(notificationPopup, notificationContent);
		};
	});
	document.getElementById('searchForm').addEventListener('submit', function(event) {
		event.preventDefault();
		var resultsArea = document.getElementById('resultsArea');
		hide(resultsArea);
		var searchTerm = document.getElementById('searchBox').value;
		var searchUnit;
		var searchDomain;
		var searchTier;
		
		var searchUnitTypes = document.getElementsByName('searchUnitType');
		for (var i=0; i<searchUnitTypes.length; i++) {
			if (searchUnitTypes[i].checked === true) {
				searchUnit = searchUnitTypes[i].value;
			}
		}
		var searchDomainTypes = document.getElementsByName('searchDomainType');
		for (var i=0; i<searchDomainTypes.length; i++) {
			if (searchDomainTypes[i].checked === true) {
				searchDomain = searchDomainTypes[i].value;
			}
		}
		
		var searchTiers = document.getElementsByName('tierType');
		for (var i=0; i<searchTiers.length; i++) {
			if (searchTiers[i].checked === true) {
				searchTier = searchTiers[i].value;
			}
		}
		
		if (searchTerm !== "undefined" && searchTerm !== "") {
			concordanceSearch(searchUnit, searchDomain, searchTier, searchTerm);
		}
		lastSearch = {
			searchUnit: searchUnit,
			searchDomain: searchDomain,
			searchTerm: searchTerm,
			searchTier: searchTier
		};
		
		display(resultsArea);
		document.getElementById('selectedAction').value = "chooseAction";
		document.getElementById('searchBox').value = "";
	});
	document.getElementById('searchBox').addEventListener('focus', function(event) {
		lastFocusedInputBox = event.target;
	});
	document.getElementById('selectedAction').addEventListener('change', function(event) {
		var bulkActionsPopup = document.getElementById('bulkActionsPopup');
		var glossActionPopup = document.getElementById('glossActionPopup');
		var morphemeAnalysisActionPopup = document.getElementById('morphemeAnalysisActionPopup');
		var morphemeBox = document.getElementById('morphemeBox');
		
		hide(glossActionPopup);
		hide(morphemeAnalysisActionPopup);
		hide(tagActionPopup);
		hide(bulkActionsPopup);
		
		switch (event.target.value) {
			case "chooseAction":
				break;
			case "glossAction":
				display(glossActionPopup);
				display(bulkActionsPopup);
				break;
			case "morphemeAnalysisAction":
				display(morphemeAnalysisActionPopup);
				display(bulkActionsPopup);
				
				document.getElementById('lexiconList').innerHTML = "";
				displayLexicon();
				display(lexiconOverviewModule);
				document.getElementById('lexiconNav').className = "navSelected";
				document.getElementById('textsNav').className = "";
				document.getElementById('tagsNav').className = "";
				document.getElementById('detailPaneHeader').innerHTML = "Lexeme";
				
				morphemeBox.focus();
				morphemeBox.innerHTML = "";
				var optionListItemTemplate = document.getElementById('optionListItemTemplate');
				var option = optionListItemTemplate.content.querySelector('option');
				database.lexica[0].lexEntries.forEach(function(lexEntry, i) {
					if (typeof lexEntry.lemma === "undefined") {
						lexEntry.lemma = "";
					}
					if (typeof lexEntry.gloss === "undefined") {
						lexEntry.gloss = "";
					}
					option.innerHTML = lexEntry.lemma + ": " + lexEntry.gloss;
					var newOption = optionListItemTemplate.content.cloneNode(true);
					morphemeBox.appendChild(newOption);
				});
				break;
			case "tagAction":
				display(tagActionPopup);
				display(bulkActionsPopup);
				document.getElementById('tagCategoryBox').focus();
			case "searchWithinItemsAction":
				break;
			default:
		}
	});
	document.getElementById('settingsButton').addEventListener('click', function(event) {
		if (document.getElementById('settingsPopup').style.display === "flex") {
			hide(document.getElementById('settingsPopup'));
		} else {
			display(document.getElementById('settingsPopup'));
		}
	});
	document.getElementById('shortcutBox').addEventListener('focus', function(event) {
		display(document.getElementById('shortcutsPopup'));
	});
	document.getElementById('tagsOverviewModule').addEventListener('submit', function(event) {
		event.preventDefault();
		tags = document.getElementsByName('dataTag');
		for (var i=0; i<tags.length; i++) {
			if (tags[i].checked) {
				tagSet = tags[i].id.split(":", 2);
				category = tagSet[0];
				value = tagSet[1];
				deleteTag(category, value);
				displayTagsList();
			}
		}
	});
	document.getElementById('tagActionPopup').addEventListener('submit', function(event) {
		event.preventDefault();
		var tagCategory = document.getElementById('tagCategoryBox').value;
		var tagValue = document.getElementById('tagValueBox').value;
		
		var selectedHits = [];
		hits.forEach(function(hit, i) {
			if (document.getElementById("searchResultCheckbox" + i).checked === true) {
				selectedHits.push(hit);
			}
		});
		
		var tagsApplied = 0;
		selectedHits.forEach(function(hit) {
			addTag(tagCategory, tagValue, hit.textIndex, hit.phraseIndex, hit.wordIndex);
			tagsApplied += 1;
		});
		
		document.getElementById('totalTagsApplied').innerHTML = "Total tags applied: " + tagsApplied;
		tagCategory.value = "";
		tagValue.value = "";
		displayTagsList();
	});
	document.getElementById('tagsList').addEventListener('contextmenu', function(event) {
		event.preventDefault();
		var menu = document.getElementById('rightClickMenu');
		var menuList = document.querySelector('#rightClickMenu ul');
		var selectedTag = event.target;
		
		var deleteOption = document.createElement('li');
		deleteOption.innerHTML = "Delete this tag";
		menuList.appendChild(deleteOption);
		var displayOption = document.createElement('li');
		displayOption.innerHTML = "Display phrases with this tag";
		menuList.appendChild(displayOption);
		
		menu.style.left = event.clientX + "px";
		menu.style.top = event.clientY + "px";
		menu.style.transform = "translateX(0)";
		display(menu);
		
		deleteOption.addEventListener('click', function(event) {
			var tag = selectedTag.id.split(":");
			tagCategory = tag[0];
			tagValue = tag[1];
			deleteDatabaseTag(tagCategory, tagValue);
		});
		
		displayOption.addEventListener('click', function(event) {
			var tag = selectedTag.id.split(":");
			tagCategory = tag[0];
			tagValue = tag[1];
			searchForPhraseTag(tagCategory, tagValue);
			displaySearchHits(hits);
		});

		menu.addEventListener('click', function(event) {
			hide(menu);
		});
		
		document.body.addEventListener('click', hideMenu);
	});
	graphemesList.addEventListener('click', function(event) {
		if (event.target.tagName === "IMG" && event.target.parentNode.id.split("_")[0] === "graphemeIndex") {
			var orthography = database.orthographies[database.preferences.currentOrthographyIndex];
			orthography.graphemes.splice(event.target.parentNode.id.split("_")[1], 1);
			displayOrthography(database.preferences.currentOrthographyIndex);
		}
	});
	graphemesList.addEventListener('input', updateGrapheme);
	orthographiesDropdown.addEventListener('change', function(event) {
		var selectOrthographyOption = document.getElementById('selectOrthographyOption');
		var selectedIndex = orthographiesDropdown.selectedIndex;
		var orthographyIndex = orthographiesDropdown[selectedIndex].orthographyIndex;
		displayOrthography(orthographyIndex);
	});
	overviewPaneNav.addEventListener('click', function(event) {
		var selectedModule = event.target.id.replace("Nav", "");
		setModule(selectedModule);
	});
	statisticsButton.addEventListener('click', function(event) {
		if (statisticsPopup.style.display === "flex") {
			hide(statisticsPopup);
		} else {
			display(statisticsPopup);
		}
	});
	window.addEventListener('load', loadEnvironment);
	window.setInterval(saveEnvironment, 60000);
	
	// DISPLAY STATES
		document.getElementById('closeOverviewPane').addEventListener('click', function(event) {
			if (database.preferences.currentDisplayState === [1, 1, 1]) {
				displayState(0, 1, 1);
			} else if (database.preferences.currentDisplayState[1] === 0 && database.preferences.currentDisplayState[2] === 0) {
				displayState(0, 1, 1);
			} else {
				displayState(0, database.preferences.currentDisplayState[1], database.preferences.currentDisplayState[2]);
			}
			
			database.preferences.currentDisplayState[0] = 0;
		});
		document.getElementById('closeDetailPane').addEventListener('click', function(event) {
			if (database.preferences.currentDisplayState === [1, 1, 1]) {
				displayState(1, 0, 1);
			} else if (database.preferences.currentDisplayState[0] === 0 && database.preferences.currentDisplayState[2] === 0) {
				displayState(1, 0, 1);
			} else {
				displayState(database.preferences.currentDisplayState[0], 0, database.preferences.currentDisplayState[2]);
			}
			
			database.preferences.currentDisplayState[1] = 0;
		});
		document.getElementById('closeToolbarPane').addEventListener('click', function(event) {
			if (database.preferences.currentDisplayState === [1, 1, 1]) {
				displayState(1, 1, 0);
			} else if (database.preferences.currentDisplayState[0] === 0 && database.preferences.currentDisplayState[1] === 0) {
				displayState(1, 1, 0);
			} else {
				displayState(database.preferences.currentDisplayState[0], database.preferences.currentDisplayState[1], 0);
			}
			
			database.preferences.currentDisplayState[2] = 0;
		});
		document.getElementById('overviewPaneShiftLeft').addEventListener('click', function(event) {
			if (database.preferences.currentDisplayState[0] <= currentMinFlex) {
				displayState(0, database.preferences.currentDisplayState[1], database.preferences.currentDisplayState[2])
			} else if (database.preferences.currentDisplayState[1] === 0) {
				displayState(database.preferences.currentDisplayState[0], currentMinFlex, database.preferences.currentDisplayState[2]*2);
			} else {
				displayState(database.preferences.currentDisplayState[0], database.preferences.currentDisplayState[1]*2, database.preferences.currentDisplayState[2]*2);
			}
		});
		document.getElementById('overviewPaneShiftRight').addEventListener('click', function(event) {
			if (database.preferences.currentDisplayState[0] === 0) {
				displayState(currentMinFlex, database.preferences.currentDisplayState[1], database.preferences.currentDisplayState[2]);
			} else if (database.preferences.currentDisplayState[1] <= currentMinFlex) {
				database.preferences.currentDisplayState[1] = 0;
			} else if (database.preferences.currentDisplayState[2] <= currentMinFlex) {
				database.preferences.currentDisplayState[2] = 0;
			}
			
			displayState(database.preferences.currentDisplayState[0]*2, database.preferences.currentDisplayState[1], database.preferences.currentDisplayState[2]);
		});
		document.getElementById('toolbarPaneShiftRight').addEventListener('click', function(event) {
			if (database.preferences.currentDisplayState[2] <= currentMinFlex) {
				displayState(database.preferences.currentDisplayState[0], database.preferences.currentDisplayState[1], 0);
			} else if (database.preferences.currentDisplayState[1] === 0) {
				displayState(database.preferences.currentDisplayState[0]*2, currentMinFlex, database.preferences.currentDisplayState[2]);
			} else {
				displayState(database.preferences.currentDisplayState[0]*2, database.preferences.currentDisplayState[1]*2, database.preferences.currentDisplayState[2]);
			}
		});
		document.getElementById('toolbarPaneShiftLeft').addEventListener('click', function(event) {
			if (database.preferences.currentDisplayState[2] === 0) {
				displayState(database.preferences.currentDisplayState[0], database.preferences.currentDisplayState[1], currentMinFlex);
			} else if (database.preferences.currentDisplayState[1] <= currentMinFlex) {
				database.preferences.currentDisplayState[1] = 0;
			} else if (database.preferences.currentDisplayState[0] <= currentMinFlex) {
				database.preferences.currentDisplayState[0] = 0;
			}
			
			displayState(database.preferences.currentDisplayState[0], database.preferences.currentDisplayState[1], database.preferences.currentDisplayState[2]*2);
		});