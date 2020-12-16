let fs = require('fs');
const fetch = require('node-fetch');

getData = async() =>{
    let weapData = {
        'allWeapons' : []
    }
    console.log(weapData.allWeapons);
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
                        if(!weapData.allWeapons.includes(json._items[j])){
                            weapData.allWeapons.push(json._items[j])
/*                             fs.appendFile('weapon_data.json', JSON.stringify(json._items[j]), function(e){
                                if(e) throw e;

                            }); */
                        }else{console.log('DUPLICATE')}
                    } 
                }
            } 
        })
    }
    fs.writeFile('weapon_data.json', JSON.stringify(weapData.allWeapons), (e) => {if(e) throw e });
    console.log(weapData.allWeapons[7]);
    let b = new Date();
    console.log('DATA FETCH COMPLETE!');
    console.log('Time to Complete(ms)', b - a );
}

getData();

