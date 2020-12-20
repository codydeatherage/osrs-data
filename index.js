let fs = require('fs');
const fetch = require('node-fetch');

getData = async() =>{
    let itemData = {
        'weapon' : [],
        'head' : [],
        'cape': [],
        'neck': [],
        'ammo' : [],
        'body':[],
        'shield':[],
        'legs': [],
        'hands': [],
        'feet': [],
        'ring': []
    }
    let pageNumber = 1;
    /*   const eMax_Pages = 146; */
    let eMax_Pages = 74;
    let a = new Date();
    console.log('Beginning fetch....');
    for(let i = pageNumber; i <= eMax_Pages; i++){
        await fetch(`https://api.osrsbox.com/equipment?max_results=50&&page=${i}`)
        .then(response => response.json())
        .then(json => {
            for (let j = 0; j < json._items.length; j++) {
                const {name, equipment, id, icon} = json._items[j];
                      //filter out items that give minimal bonuses *prayer is omitted*
                if((equipment.attack_stab >= 4 || equipment.attack_slash >= 4 || equipment.attack_crush >= 4
                    || equipment.attack_magic >= 4 || equipment.attack_ranged >= 4 || equipment.melee_strength >= 4 
                    || equipment.ranged_strength >= 4 || equipment.magic_damage >= 4) || name.toLowerCase().includes('void')
                    || name.toLowerCase().includes('slayer helm') //exceptions are made for slayer helm and void equipment
                ){
                    if(equipment.slot === 'weapon' || equipment.slot === '2h'){
                        if(!itemData.weapon.includes(json._items[j])){
                            itemData.weapon.push(json._items[j])
                        }
                    }
                    else{
                        if(!itemData[`${equipment.slot}`].includes(json._items[j])){
                            itemData[`${equipment.slot}`].push(json._items[j]);
                        }
                    } 
                }
            } 
        })
    }
    /* fs.writeFile('weapon_data.json', JSON.stringify(itemData.weapon), (e) => {if(e) throw e }); */
    /* console.log(weapData.allWeapons[7]); */
    for(let key in itemData){
        fs.writeFile(`${key}_data.json`, JSON.stringify(itemData[`${key}`]), (e) => {if(e) throw e });
    }
    let b = new Date();
    console.log('DATA FETCH COMPLETE!');
    console.log('Time to Complete(ms)', b - a );
}

getData();