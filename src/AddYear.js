import React, { useState } from 'react';
import './App.css';

const AddYear = ({ character, setCharacter, setShowClassModal, setLogMessage }) => {
  const [isDead, setIsDead] = useState(false);
  const [yearsAsFrog, setYearsAsFrog] = useState(0);
  

  const yearSummaries = [
    "Accidentally spilled a potion, growing a third ear for a week.",
    "Took a quest to find missing socks from the local laundry mage.",
    "Got into a heated debate with a mimic posing as a chamber pot.",
    "Won a drinking contest against a dwarf. (The dwarf is still in disbelief.)",
    "Ate a mysterious berry and only spoke in rhyme for three days.",
    "Tried to tame a squirrel. It now thinks it's a dragon.",
    "Played cards with a mind flayer and only lost two memories.",
    "Bought a magical cloak. Turned out to just be a very fashionable blanket.",
    "Got stuck in an infinite loop after mispronouncing a spell.",
    "Had a dance-off with an elf. Elves can't moonwalk, apparently.",
    "Befriended a rock. Turns out, it was a very shy golem.",
    "Sang a duet with a bard. Broke three windows.",
    "Found a ring of invisibility. Lost it immediately.",
    "Pranked a wizard. Was a chicken for a day.",
    "Helped a troll with its crossword puzzle.",
    "Slept on a bed of moss. Woke up floating three feet in the air.",
    "Joined a thieves' guild bake sale. Stole all the pies.",
    "Went fishing. Caught a book of aquatic poetry.",
    "Tried a dragon's chili recipe. Breathed fire for an hour.",
    "Gave a ghost a back massage. Got paid in ethereal coins.",
    "Purchased boots of speed. They were two sizes too small.",
    "Played chess with a goblin. Checkmated in two moves.",
    "Took a nap on a treant's branch. Got mistaken for a bird.",
    "Helped a kobold find its glasses. They were on its head.",
    "Went on a wild goose chase. Literally. The goose had a bounty.",
    "Faced off with a mimic disguised as a tax form.",
    "Attended a gelatinous cube's dance party. Very squishy.",
    "Played hide and seek with a rogue. Haven't found them yet.",
    "Had a pillow fight with a fairy. Was outmatched.",
    "Got cursed by a hag to only walk backwards for a day.",
    "Lent a vampire a sun hat.",
    "Grew a beard after a mix-up with a potion. Shaved it off, it's now a rug.",
    "Went to a witch's tea party. The tea was a bit barky.",
    "Tried to outstare a medusa. Thankfully, she wore sunglasses.",
    "Raced a centaur. Came second. The centaur was third.",
    "Used a wand of magic missile at a fireworks festival. Big hit.",
    "Joined a harpy choir. Couldn’t hit the high notes.",
    "Participated in a minotaur's labyrinth hide and seek game.",
    "Won an arm-wrestling match against an ogre. Used both hands.",
    "Accidentally swapped bodies with a cat. Chased a mouse.",
    "Asked a necromancer for skincare tips. Now glowing.",
    "Did stand-up at a tavern. Got heckled by a goblin.",
    "Tried on a cursed necklace. Grew antlers for a week.",
    "Stole a dragon's hoard. It was a pile of plushies.",
    "Baked cookies with a dryad. Got a splinter.",
    "Borrowed a book from a lich. It was a rom-com.",
    "Played fetch with a hellhound. Used a flaming bone.",
    "Had a picnic with a pixie. Sandwiches went missing.",
    "Was outwitted by a sentient potato.",
    "Gave a werewolf a belly rub.",
    "Spent an hour trying to convince a stubborn lock to unlock.",
    "Wore shoes of levitation. Hit the ceiling.",
    "Adopted a blink dog. Now can’t find it.",
    "Did the limbo with a skeleton. It cheated.",
    "Challenged a ghoul to a thumb war. It was a tie.",
    "Tickled a giant. Caused a minor earthquake.",
    "Cleaned a rust monster. Found some loose change.",
    "Had a staring contest with a basilisk. Wore mirrored shades.",
    "Ordered a salad at a vampire tavern. Got a blood orange.",
    "Tried to juggle with a doppelganger. Confusing.",
    "Used a potion as a mouthwash. Spoke in bubbles.",
    "Entered a mummy's tomb. Got wrapped up in things.",
    "Did the tango with a banshee. Eardrums hurt.",
    "Punched a goblin out at a bar over a bar tab.",
    "Made candles with a wight. A bit waxy.",
    "Went skinny dipping in a nymph's pond. Turned blue.",
    "Asked an orc for hair styling tips. Went bald.",
    "Used a decanter of endless water for a shower.",
    "Had a snowball fight with an ice elemental.",
    "Pinned a 'Kick me' sign on a bugbear.",
    "Became a tree for a day after offending a druid.",
    "Borrowed a scroll. It was a comic strip.",
    "Played fetch with a griffon. Lost the stick.",
    "Pranked a monk. Levitated for an hour.",
    "Sang with sirens. Voice was a bit off-key.",
    "Stole candy from a baby owlbear.",
    "Fixed a broken wand with duct tape.",
    "Went on a blind date with a specter.",
    "Dined with a king. He was a toad.",
    "Played hopscotch in a giant's courtyard.",
    "Tried to catch a pegasus with a butterfly net.",
    "Went shopping with a sprite. Only bought glitter.",
    "Used a crystal ball as a bowling ball.",
    "Partied with satyrs. Woke up in a tree.",
    "Took a beholder's eye exam.",
    "Hunted with a chimera. Only caught a cold.",
    "Gave a troll a manicure.",
    "Played peek-a-boo with a phantom.",
    "Used a feather from an angel's wing as a quill.",
    "Rode a broomstick. Crashed into a tree.",
    "Tricked a devil with a rubber coin.",
    "Dined with ghouls. Avoided the finger food.",
    "Used a mermaid's comb. Hair got very wavy.",
    "Played tag with shadows.",
    "Danced with a dervish. Got very dizzy.",
    "Went to a hydra's head-counting party.",
    "Had a pillow fight with a succubus. Dreamy.",
    "Played darts with a sorcerer. Turned into a frog.",
    "Studied with a lich. Had to pull an all-nighter.",
    "Did the macarena with zombies. Lost a limb.",
    "Took a selfie with a banshee. Camera broke.",
    "Joined a band of bard bards. It was... barb-rous.",
    "Used a mimic as a treasure chest. Friends weren’t amused.",
    "Tried to tickle a gelatinous cube. It didn't jiggle.",
    "Lost a sock in the Underdark.",
    "Challenged a pixie to a height contest. Lost by a whisker.",
    "Dyed a dragon's scales. It wasn’t thrilled.",
    "Held a kobold's lantern. It just kept hissing.",
    "Ate a gnome-made pie. Still floating...",
    "Used a wand as a back scratcher. Now has a scaly patch.",
    "Asked a griffon about the 'bird and the bees'. Got a two-hour lecture.",
    "Wore boots of elvenkind in a dwarf tavern. Slippery situation.",
    "Bribed a gnome with cheese. Still doesn't know why.",
    "Lost a game of hide-and-seek to a ninja.",
    "Played fetch with a manticore. Still finding spines.",
    "Had tea with a treant. It was barkingly good.",
    "Joined a hag’s crochet club. Now owns a cursed scarf.",
    "Helped a dwarf find his beard. It was on a bird.",
    "Rode an elevator with an ettin. Got double the chat.",
    "Made a hat for a mind flayer. It was tentacular!",
    "Gave a dragon spicy curry. Regretted it quickly.",
    "Listened to a banshee’s lullaby. Couldn’t sleep for a week.",
    "Told ghost stories to specters. Got boo-ed off.",
    "Sewed with a spider. Web-tastic results.",
    "Wore a cloak of billowing on a windy day. Ended up in a tree.",
    "Played cards with a deck of many things. Got many socks.",
    "Had a drink-off with a water elemental. It never ends.",
    "Meditated with a medusa. Achieved stone-like focus.",
    "Entered a fairy circle. Left with sparkly toes.",
    "Stood guard for a village against wandering monsters.",
    "Helped a young dragon find its lost parent.",
    "Went on a personal quest to retrieve a stolen family heirloom.",
    "Guided a group of refugees through treacherous terrains.",
    "Assisted a mage in gathering rare ingredients for a crucial potion.",
    "Negotiated peace between two feuding goblin tribes.",
    "Repaired an ancient shrine, bringing joy to the local villagers.",
    "Taught sword fighting to the youngsters in a remote village.",
    "Rescued a captured fairy from the clutches of a dark sorcerer.",
    "Helped restore an old library, unearthing forgotten lore.",
    "Stood against the corruption in a town's leadership.",
    "Aided a lost phoenix find its way back to its fiery nest.",
    "Joined a ranger on a quest to map uncharted territories.",
    "Safeguarded a caravan from bandits on a treacherous journey.",
    "Helped a group of dwarves reclaim their overrun mine.",
    "Acted as a mediator in a dispute between elves and humans.",
    "Located and returned stolen livestock to a farming village.",
    "Helped build a bridge, connecting two distant communities.",
    "Solved the mystery of a haunted mansion, bringing peace to its spirits.",
    "Provided healing to a village struck by a mysterious illness.",
    "Retrieved a sacred relic from a forgotten temple.",
    "Assisted in rebuilding a town after a devastating dragon attack.",
    "Offered guidance to a young sorcerer struggling with their powers.",
    "Guarded a portal, ensuring no malevolent beings passed through.",
    "Unraveled the riddle of a sphinx, gaining its respect.",
    "Faced inner demons in a trial of mental strength.",
    "Helped nature spirits cleanse a corrupted forest.",
    "Delivered a crucial message through a battleground, ensuring a truce.",
    "Tracked and apprehended a notorious thief, recovering stolen goods.",
    "Lent strength to a fortress' defense against a horde of orcs.",
    "Mediated a dispute between miners and mountain spirits.",
    "Assisted a village in setting up defenses against potential threats.",
    "Rescued a group of explorers from a treacherous mountain path.",
    "Guided lost souls to the afterlife, ensuring their peaceful rest.",
    "Deciphered an ancient script, uncovering lost knowledge.",
    "Protected a rare creature from poachers, ensuring its safety.",
    "Braved a storm to deliver supplies to a stranded group.",
    "Brought justice to a corrupt noble, liberating a town.",
    "Shared tales of bravery, inspiring a new generation of adventurers.",
    "Ensured safe passage for pilgrims traveling to a sacred site.",
    "Gave a proper burial to fallen warriors on a forgotten battlefield.",
    "Protected a magical grove from those who'd exploit its power.",
    "Met a guy named Logan he was very blonde",
    "Met a guy named Nazrat seemed like an odd guy",
    "Thought of a great idea for puppet show it was about a rubber pirate",
    "Tripped into a portal and ruined a lich's tea party.",
    "Lost a staring contest to a one-eyed cyclops.",
    "Challenged a ghost to a game of tag. It was hauntingly fun.",
    "Borrowed a centaur's shoes. Quadruple the style.",
    "Joined a kobold's knitting club. Made a sock for a dragon.",
    "Woke up with a pixie beard after a night of revelry.",
    "Lost a footrace to a tortoise. Claims it had a hare up its sleeve.",
    "Spent a day in an ogre's shoe. Mistakenly thought it was a cave.",
    "Got stuck in a gelatinous cube's embrace. It was just lonely.",
    "Tried to play fetch with a basilisk. It was petrifying.",
    "Had a cook-off with a fire elemental. It was a hot competition.",
    "Shared a drink with a doppelgänger. The mirror effect was uncanny.",
    "Played charades with a mime mimic. Mind-bending.",
    "Listened to a banshee's stand-up routine. Died laughing.",
    "Spent a day shadowing a shadow. It was enlightening.",
    "Cooked with a treant. Salad was off the menu.",
    "Hired by goblins as a bugbear scarer.",
    "Slept on a mimic bed. Woke up in its embrace.",
    "Bought a ticket to a beholder's beauty contest.",
    "Raced snails with a sloth. It was riveting.",
    "Used a decanter of endless water in a squirt gun fight.",
    "Adopted a pet rock. It's a little golem.",
    "Sang a duet with a deaf banshee. The silence was eerie.",
    "Dyed an elf's hair while he slept. It was... vibrant.",
    "Played hopscotch with a hopping potion.",
    "Got lost in a gnome-sized corn maze.",
    "Played spin the bottle with a group of mimics.",
    "Borrowed a dryad's favorite branch. She was stumped.",
    "Mispronounced a spell and summoned a bunny horde.",
    "Attempted to out-prank a leprechaun. Room's still upside-down.",
    "I attempted to do a gold digger prank on a witch.. she turned me into a frog."
];


  
const getRandomSummary = () => {
  const randomIndex = Math.floor(Math.random() * yearSummaries.length);
  return yearSummaries[randomIndex];
};

  const handleAgeIncrement = () => {
    if (character) {
      if (character.Age > 50) {
        const deathChance = Math.random();
        if (deathChance < 0.10) {
          setIsDead(true);
          setLogMessage(prevLog => prevLog + "\n" + character.FirstName + " " + character.LastName + " has died.");
          return;
        }
      }
      // Check if the character's age is 17 and a class hasn't been chosen
      if (character.Age === 17 && !character.Class) {
        setShowClassModal(true); // use the passed down prop function
        return;
      }
      
      let summary = "";
      summary = "";
    
    if (character.Age > 15 && Math.random() < 0.30) { // 30% chance after age 15
     summary = getRandomSummary();
     
     if (summary === "I attempted to do a gold digger prank on a witch.. she turned me into a frog.") {
      // Save the original race if the character is being turned into a 
      
      if (character.Race !== 'Frog') {
        setCharacter(prevCharacter => ({
          ...prevCharacter,
          OriginalRace: prevCharacter.Race,
          Race: 'Frog',
        
        }));
       
      }
      setYearsAsFrog(1);
    } else if (yearsAsFrog > 0) {
      setYearsAsFrog(prevYears => prevYears - 1);
      if (yearsAsFrog === 1) {
        // Revert race back to original
        setCharacter(prevCharacter => ({
          ...prevCharacter,
          Race: prevCharacter.OriginalRace // revert to the original race
        }));
      }
    }
   
    }
    

      setCharacter(prevCharacter => ({
        ...prevCharacter,
        Age: prevCharacter.Age + 1
      }));

      setLogMessage(prevLog => prevLog + `<br><strong>${character.FirstName} is now ${character.Age + 1} years old:</strong><br> ${summary}`);
      
    }
    
    

  
  };

  const handleRestart = () => {
    const userConfirmed = window.confirm("Are you sure you want to restart?");
    
    if (userConfirmed) {
      setIsDead(false);
      setCharacter(null);
      setLogMessage("");

      const resetEvent = new Event('characterReset', { 'bubbles': true });
      window.dispatchEvent(resetEvent);
    }
  };

  if (isDead) {
    return (
      <div>
        <button style={{ backgroundColor: 'red', color: 'white' }} onClick={handleRestart}>Restart</button>
      </div>
    );
  }

  return (
   <button onClick={handleAgeIncrement}>Add a Year</button>
    
  );

};

export default AddYear;