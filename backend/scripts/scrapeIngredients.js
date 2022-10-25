/* eslint-disable no-unused-vars, no-empty */

const events = require('events');
const fs = require('fs');
const readline = require('readline');
const axios = require('axios');
const mongoose = require('mongoose');

const rl = readline.createInterface({
  input: fs.createReadStream(__dirname + '/../data/products_with_data.json'),
  crlfDelay: Infinity
});

async function searchPubChemByName(name) {
  return await axios({
    url: `https://pubchem.ncbi.nlm.nih.gov/rest/pug/concepts/name/\
JSON?name=${name}`,
    method: 'GET'
  }).catch((e) => {
    return e.response;
  });
}

async function searchPubChemByCID(cid) {
  return await axios({
    url: `https://pubchem.ncbi.nlm.nih.gov/rest/pug_view/data/compound/${cid}/\
JSON/`,
    method: 'GET'
  }).catch((e) => {
    return e.response;
  });
}

function handleRecordDescription(section) {
  let text = '';
  for (let info of section.Information) {
    info.Description && (text += info.Description + '\n');
    text += info.Value.StringWithMarkup[0].String + '\n\n';
  }
  return text;
}

function handleSynonyms(section) {
  for (let subsection of section.Section) {
    if (subsection.TOCHeading === 'Depositor-Supplied Synonyms') {
      return subsection.Information[0].Value.StringWithMarkup.map(
        i => i.String) || [];
    }
  }
  return [];
}

function handleSafetyAndhazards(section) {
  const effects = [];
  const newEffects = [];
  for (let subsection of section.Section) {
    if (subsection.TOCHeading === 'Hazards Identification') {
      for (let subsubsection of subsection.Section) {
        if (subsubsection.TOCHeading === 'GHS Classification') {
          for (let info of subsubsection.Information) {
            if (info.Name === 'GHS Hazard Statements') {
              for (let string of info.Value.StringWithMarkup) {
                if (string.String.startsWith('H350')) {
                  effects.indexOf('H350') === -1 && effects.push('H350');
                }
                if (string.String.startsWith('H350i')) {
                  effects.indexOf('H350i') === -1 && effects.push('H350i');
                }
                if (string.String.startsWith('H351')) {
                  effects.indexOf('H351') === -1 && effects.push('H351');
                }
                if (string.String.startsWith('H400')) {
                  effects.indexOf('H400') === -1 && effects.push('H400');
                }
                if (string.String.startsWith('H401')) {
                  effects.indexOf('H401') === -1 && effects.push('H401');
                }
                if (string.String.startsWith('H402')) {
                  effects.indexOf('H402') === -1 && effects.push('H402');
                }
                if (string.String.startsWith('H410')) {
                  effects.indexOf('H410') === -1 && effects.push('H410');
                }
                if (string.String.startsWith('H411')) {
                  effects.indexOf('H411') === -1 && effects.push('H411');
                }
                if (string.String.startsWith('H412')) {
                  effects.indexOf('H412') === -1 && effects.push('H412');
                }
                if (string.String.startsWith('H413')) {
                  effects.indexOf('H413') === -1 && effects.push('H413');
                }
                if (string.String.startsWith('H420')) {
                  effects.indexOf('H420') === -1 && effects.push('H420');
                }
              }
            }
          }
        }

        if (subsubsection.TOCHeading === 'Hazards Summary') {
          for (let info of subsubsection.Information) {
            if (info.Value.StringWithMarkup[0].String.indexOf('allerg') > -1) {
              const effect = {
                _id: mongoose.Types.ObjectId(),
                name: 'Allergy',
                description: info.Value.StringWithMarkup[0].String,
                effectType: 'allergy',
                score: Math.floor(Math.random() * 9) + 1
              };
              effects.push(effect);
              newEffects.push(effect);
            }
          }
        }
      }
    }
  }
  return [effects, newEffects];
}

function handleToxicity(section) {
  console.log('--- Toxicity ---');
  console.log(section);
  for (let subsection of section.Section) {
    if (subsection.TOCHeading === 'Uses') {
      console.log(subsection);
      console.log(
        subsection.Information[0].Value.StringWithMarkup.map(i => i.String));
    }
  }
}


function handleAssociatedDisordersAndDiseases(section) {
  console.log('--- Associated Disorders and Diseases ---');
  console.log(section);
  for (let reference of section.Reference) {
    if (reference.sourceName === 'Comparative Toxicogenomics Database (CTD)') {
    }
  }
}

(async () => {

  const ingredientSet = new Set();
  const effectSet = new Set();

  let count = 1;

  for await (const line of rl) {

    console.log(count);

    const product = JSON.parse(line);

    if (Array.isArray(product.ingredients)) {

      for (let ingredient of product.ingredients) {
        const respCID = await searchPubChemByName(ingredient);

        if (!respCID || respCID.status !== 200) {
          console.log('error');
          continue;
        }

        const cid = respCID.data.ConceptsAndCIDs.CID[0];
        const respData = await searchPubChemByCID(cid);

        if (!respData || respData.status !== 200) {
          console.log('error');
          continue;
        }

        const name = respData.data.Record.RecordTitle;

        if (ingredientSet.has(name)) {
          continue;
        }

        let description = '';
        let effects = [];
        let newEffects = [];

        let synonyms = [];

        for (let section of respData.data.Record.Section) {
          switch (section.TOCHeading) {
          case 'Names and Identifiers':
            for (let subsection of section.Section) {
              if (subsection.TOCHeading === 'Record Description') {
                description = handleRecordDescription(subsection);
              } else if (subsection.TOCHeading === 'Synonyms') {
                synonyms = handleSynonyms(subsection);
              }
            }
            break;
          case 'Safety and Hazards':
            [effects, newEffects] = handleSafetyAndhazards(section);
            break;
          case 'Toxicity':
            // handleToxicity(section);
            break;
          case 'Associated Disorders and Diseases':
            // handleAssociatedDisordersAndDiseases(section);
            break;
          }
        }

        console.log('write');
        fs.appendFileSync(
          __dirname + '/../data/ingredients.json',
          JSON.stringify(Object.assign({
            name,
            description,
            effects: effects.concat(newEffects.map(item => item._id))
          })) + '\n');

        for (let newEffect of newEffects) {
          if (effectSet.has(newEffect.description)) {
            continue;
          }
          fs.appendFileSync(
            __dirname + '/../data/new_effects.json',
            JSON.stringify(Object.assign(newEffect)) + '\n');
          effectSet.add(newEffect.description);
        }

        for (let synonym of synonyms) {
          fs.appendFileSync(
            __dirname + '/../data/synonyms.json',
            JSON.stringify(Object.assign({
              ingredient: name,
              name: synonym
            })) + '\n');
        }

        ingredientSet.add(name);

      }
    }

    count++;
  }

  await events.once(rl, 'close');

})();
