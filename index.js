let fs = require('fs');
const fetch = require('node-fetch');


getBossData = async () => {
    let pageNumber = 1;
    let eMax_Pages = 57;
    let bossData = [];
    let a = new Date();
    console.log('Beginning fetch....');
    for(let i = pageNumber; i <= eMax_Pages; i++){
    await fetch(`https://api.osrsbox.com/monsters?max_results=50&&page=${i}`)
        .then(response => response.json())
        .then(json => {
            for (let j = 0; j < json._items.length; j++) {
                const {category, name, id} = json._items[j];
                if(!bossData.includes(json._items[j])){
                    if(category.includes('boss')){
                        bossData.push(json._items[j]);
                    }
                }
            }
        })
    }
    for(let boss of bossData){
        fs.writeFile(`boss_data.json`, JSON.stringify(bossData), (e) => {if(e) throw e });
    }
}

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

getBookData = () => {
    const myKey= 'AIzaSyCoTjWx6oEMlNzakkbhWJou6y2zqgyXt7U';
    fetch(`https://www.googleapis.com/books/v1/volumes?q=flowers for algernon+inauthor:keyes&key=${myKey}&langRestrict=en`)
        .then(response => response.json())
        .then( json => {
            console.log(json);
            fetch(json.items[0].selfLink)
            .then(response => response.json())
            .then(json => {
                console.log(json);
                console.log(json.volumeInfo.description);
            })
        })
}

getBookData();
//getData();
//getBossData();