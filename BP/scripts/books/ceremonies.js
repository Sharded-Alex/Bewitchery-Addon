export const ceremony_book = {
    "intro": {
        "title": "Ceremonial Basics",
        "body": [
            "A well practiced pattern of actions, laying down of items and observing potentially important correspondences that reliably produces a magical effect when sufficiently charged. For the witch, this is a Ceremony, a Ritual, a Rite.",
            "",
            "In actual practice, ceremonies are simple. The most difficult aspect of any ritual relies on setting up what witches tend to call a §dritual space§r, prepared with ritual slates in the correct formations and blocks of ambient mystical power. This space is usually determined once (through physical placing of blocks and decoration) and then added to and subtracted from, depending on the grand working that is meant to take place there.",
            "",
            "As we continue, you will come to understand how to build ceremonial formations, the different ways to charge rituals, the costs of them and the consequences attached to them when successful.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Ritual Formations",
                "buttonIcon": "textures/book_icons/urrican_pattern",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.formations"
                    }
                ]
            },
            {
                "buttonName": "Ritual Energies",
                "buttonIcon": "textures/items/essence/raw_orbos",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.energies"
                    }
                ]
            },
            {
                "buttonName": "Ritual Activation",
                "buttonIcon": "textures/items/tools/wands/acacia_wand",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.activation"
                    }
                ]
            },
            {
                "buttonName": "Ritual Consequences",
                "buttonIcon": "textures/book_icons/fatigue_poison",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.consequences"
                    }
                ]
            },
            {
                "buttonName": "Next Steps",
                "buttonIcon": "textures/blocks/chiseled_nether_bricks",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.next_steps"
                    }
                ]
            },
        ]
    },

    "ceremony.formations": {
        "title": "Ritual Formations",
        "body": [
            "Ritual Formations are relevant patterns that represent certain principles and guide the intent of the ritual being performed. I use the term 'guide' but in reality, any ritual you'll encounter will direct you to use the appropriate pattern/formation associated with it.",
            "",
            "Ritual formations are not built randomly. They are made up of §dritual slates§r that have been placed in the proper places and inscribed with the §dproper chalk dusts§r. They are arranged in definite styles (see §aAll Patterns§r) and the chalk used on the slates carry some amount of significance.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Ritual Slates",
                "buttonIcon": "textures/book_icons/rune_celestia",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.slates"
                    }
                ]
            },
            {
                "buttonName": "Ceremonial Scrolls",
                "buttonIcon": "textures/items/scrolls/ender_inscribed_scroll",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.scrolls"
                    }
                ]
            },
            {
                "buttonName": "All Patterns",
                "buttonIcon": "textures/book_icons/urrican_pattern",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns"
                    }
                ]
            },
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "intro"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.slates": {
        "title": "Ritual Slates",
        "body": [
            "Ritual Slates can be crafted from a variety of materials such as granite, diorite, deepslate, andesite and blackstone in the Witch's Workbench.",
            "",
            "Chalk Dusts, important components that complete ritual slates, can also be crafted in the Witch's Workbench and come in two types: Red Chalk Dust and White Chalk Dust. When used on Ritual Slates, they become inscribed with runes and this, in some ways, changes the properties of these originally mundane blocks.",
            "",
            "Red Chalk Inscribed Ritual Slates are considered §aCentral Slates§r. They serve as the absolute center of any ritual formation, and is also the point around which ritual items are thrown and at which a ritual is activated. NO Ceremony can function without one.",
            "",
            "White Chalk Inscribed Ritual Slates are a bit less foundational. These are the slates that should be used to actually §ocreate§r the pattern around the Central Slate. They are less foundational because some Fae Witches are able to substitute these for other blocks, i.e, a Hebayan Witch might use lit candles to form the Formation around a Central Slate instead of ritual slates inscribed with white chalk.",
            "",
            "White Chalk Dust can draw a variety of runes on the ritual slate. The actual rune is irrelevant; the fact that it is marked is enough. If a Witch wants to change the rune, tapping the ritual slate with a Wand is enough to cycle through the options.",
            "",
            "Runes can be erased by using wool on the ritual slate, no matter what chalk was used on it previously.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.formations"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.scrolls": {
        "title": "Ceremonial Scrolls",
        "body": [
            "There is another reason why Ritual Slates inscribed with White Chalk Dust are less important: Ceremonial Scrolls.",
            "",
            "Ceremonial Scrolls are wondrous items that are used to activate a ritual while completely ignoring ritual formations. Because of this mystical nature, they are only craftable through Primal Alchemy (see §aThe Primal Cookbook§r).",
            "",
            "Still though, many witches keep a healthy supply of these Scrolls and prefer them over Wands (which require the appropriate formations to be correct). This is especially true among Witches that like to use the mundane ambience from their sacred decorations.",
            "",
            "A small but important property of using Ceremonial Scrolls is that they ignore the Orbos of an ascended Witch. They will always defer to the local Ambience around the Central Slate.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.formations"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.all_patterns": {
        "title": "All Patterns",
        "body": [
            "Herein lies all known formations with confirmed mystical properties. To see what they actually look like, select the Pattern you want, close the book and use the book on a Central Slate. This will summon bursts of particles in the correct positions relative to the Central Slate. If at some position, they are green, a valid ritual slate (or other similar block) is there. If they are red, you should to replace the block there.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Spiral of Urrican",
                "buttonIcon": "",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns.urrican"
                    }
                ]
            },
            {
                "buttonName": "Crest of Transmutation",
                "buttonIcon": "",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns.transmutation_crest"
                    }
                ]
            },
            {
                "buttonName": "Star of Nathe",
                "buttonIcon": "",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns.nathe_star"
                    }
                ]
            },
            {
                "buttonName": "Circle of Duality",
                "buttonIcon": "",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns.duality_circle"
                    }
                ]
            },
            {
                "buttonName": "Mark of Hebaya",
                "buttonIcon": "",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns.hebaya_mark"
                    }
                ]
            },
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.formations"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.all_patterns.urrican": {
        "title": "Spiral of Urrican",
        "body": [
            "§oAn ancient pattern used primarily to summon energies relating to the Correspondences. This can still be seen in the weather rituals it is still used for. However, it is also used for Mystic Ascension and so it can never be forgotten.§r",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.all_patterns.transmutation_crest": {
        "title": "Crest of Transmutation",
        "body": [
            "§oA formation that works to draw in energies focused around material change and discovery. Crop growth and block transformations are effects that you will find this formation used for.§r",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.all_patterns.nathe_star": {
        "title": "Star of Nathe",
        "body": [
            "§oThe formation of conjuration and banishment. It is often used to conjure creatures, teleport entities and travel dimensions. In more specialized workings, it is used to wager, pact and unpact with the Lesser Fae.§r",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.all_patterns.duality_circle": {
        "title": "Circle of Duality",
        "body": [
            "§oA formation of benevolent and malevolent forces, used to both hex and cleanse. It is this formation that teaches the Witch that to uplift or to ruin draws upon a cosmic coin that holds 'light' on one side and 'dark' on the other. The choice, as usual, is theirs.§r",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.all_patterns.hebaya_mark": {
        "title": "Mark of Hebaya",
        "body": [
            "§oHebaya is an important Fae figure in the access of witchcraft (in fact, it is her we thank for guiding our magical ancestors to the foundations) and so naturally, she has her own formation. The Mark of Hebaya deals in occult bindings, ritual crafting and esoteric workings with no real place among anything else. Many Faerie Ceremonies use this formation as a crutch to bring forth their powers when there are no better alternatives (many, not all).§r",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.all_patterns"
                    }
                ]
            } // Back
        ]
    },

    "ceremony.energies": {
        "title": "Ritual Energies",
        "body": [
            "Rituals and their relationship with magical energies is a complex thing to explain but I will try to be as concise as possible.",
            "",
            "Rituals require energy to be performed and there are two ways they can acquire it:",
            "1. by pulling on the magical ambience of the immediate surroundings, or",
            "2. by being provided §dOrbos§r from the Mystic Witch activating it.",
            "",
            "-----",
            "",
            "The first method works based on the blocks found (and very recent sacrifices performed) in the vicinity of the Central Slate used to activate the ritual. Because of this lack of direct reliance on the Witch, this is how a Mundane Witch powers their rituals. Mystic and Master Witches can also use this method without much issue.",
            "",
            "The second method works based on §dOrbos§r, an internal resource a Mystic/Master Witch can gather §cbecause§r they've ascended. Since Mundane Witches have not ascended and therefore cannot gather Orbos, this option is not available to them.",
            "",
            "A Mystic Witch can use both if they do not have enough Orbos to power their ritual. In that case, Orbos is checked first and then the ambient energy in the area tries to make up the difference.",
            "",
            "-----",
            "",
            "Every 5 Ambient Energy gathered is worth 1 Orbos, regardless of type. This is important to keep in mind because many ritual instructions will list only an Orbos cost.",
            "",
            "Below, I've taken the time to further explain the consequences associated with each method of gathering energy.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Mundane Ambience",
                "buttonIcon": "textures/items/candles/green_candle",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.energies.ambience"
                    }
                ]
            },
            {
                "buttonName": "Mystic Energies",
                "buttonIcon": "textures/items/essence/raw_orbos",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.energies.orbos"
                    }
                ]
            },
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "intro"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.energies.ambience": {
        "title": "Mundane Ambience",
        "body": [
            "Ambient Energy (AE, for short) is gathered just by decorating the space around a Central Slate. All blocks around it in a 21x21 area are checked, with the Central Slate assumed to be in the dead center of this area. The blocks immediately below the Slate up to around 2 blocks above it are also checked. A list of a variety of blocks and the amount of Ambience that they generate can be found in the §oAmbient Decor Manual§r. All blocks that provide ambience will be refered to after this paragraph as §dritual decor§r.",
            "",
            "Ambient Energy comes in three (3) flavors: Pure, Tainted and Neutral. Pure Ambience aligns well with cleansing and natural rituals. Tainted Ambience thrums through malicious workings of hexes and other malefic ceremonies, and Neutral Ambience is a usable balance between the two energies that any Ceremony can use.",
            "",
            "These 'flavors' of mundane ambience are important when building up enough energy for certain rituals and, in certain cases, an overabundance of them can strengthen a ceremony's effect.",
            "",
            "§lRitual Decor Limit§r",
            "Some ritual decors can only be used to any effect a certain amount of times. This prevents a Witch from placing down a large amount of powerful ritual decors to drastically increase overall Ambience. It is because of this principle that variety is usually important.",
            "",
            "§lSymmetry§r",
            "It has been tested and confirmed that ritual decors of the EXACT same type create double the Ambience when both are radially symmetrical. Both decors must be at the same height to benefit but this is still be a powerful boon when creating ritual spaces.",
            "",
            "§lRitual Ambience Preference§r",
            "Not all rituals use every Ambience type/flavors. Thankfully, all rituals CAN use Neutral Ambience so it is a great option to consider for general use. Cleansing and more benevolent rituals use a mix of Pure and Neutral Ambience, and hexes and malefic workings usually use a mix of Tainted and Neutral Ambience. In the end, you choose how you set up your space so the choice in what Ambiences you set the stage for is always up to you.",
            "",
            "§lCorrespondences§r",
            "Certain ritual decors don't have a particular Ambience to them but instead, tap into something deeper and more primal: the Correspondences. The Correspondences are simply the circumstances under which the magic is being performed, so whether it is night or day, rain or shine, high altitude or low altitude.",
            "",
            "When these ritual decors catch certain Correspondences, they act as §aMultipliers§r for the Ambience (sometimes specific ones). As an example, Open Eyeblossoms add varying multipliers to all gathered Ambience depending on the moon phase.",
            "",
            "Other similar ritual decors ignore Correspondences but their connection is deeper, so they serve as multipliers for SPECIFIC Ambience types. As an example, Dead Coral is a strong multiplier of Tainted Ambience.",
            "",
            "Regardless of the deeper powers at work, only the first ritual decor that offers the highest multiplier is used at any given time. This means that multipliers do not stack... usually.",
            "",
            "§lCoven/Familiar Aid§r",
            "The help of a coven is an awesome way to improve the Ambience in a ritual. Covens add multipliers to Ambience as well, but these ones stack with Correspondence and become more powerful the more coven members are in range of the ritual area (8x8 sphere around the Central Slate). Familiars are counted towards this as well.",
            "",
            "When at least 1 other Coven Member is close enough to the ritual, each Coven Member increases the multiplier by 0.2 (regardless of what it was before). If the Casting Witch's Familiar is present, that is an additional +0.5. If each Coven Member, excluding the Casting Witch, has their Familiars present, that is an additional +0.15 per supporting Familiar.",
            "",
            "In practice then, a ritual being performed by 1 Witch, their Familiar, four (4) of their Coven Witches and each of these Witches' Familiars (which is an additional four) will add a multiplier of 2.1 to whatever the multiplier was before.",
            "",
            "For reference: 5 Witches [+5 x 0.2], 1 Major Familiar [+0.5], 4 Supporting Familiars [+4 x 0.15] = x2.1",
            "",
            "There is a bit of mathematics involved when dealing with covens, correspondences and Mundane Ambience overall, but the Witches that perform truly vicious hexes, truly impenetrable ritual protections and truly effective cleansings all have one thing in common: they are willing to do it for their purposes.",
            "",
            "§lEmpowerment & Permanence§r",
            "Using Mundane Ambience to power ceremonies is usually the harder option but that inconvenience comes with benefits.",
            "",
            "A ritual space with ritual decors always keeps the gathered Ambience, even after the ritual is completed. This contrasts Orbos, which is used up when used to successfully initiate a ritual. While Fatigue is still an issue, this use of surrounding energies instead of personally gathered energies (Orbos) is appealing to some witches.",
            "",
            "Additionally, some rituals can use the leftover Ambience to push themselves further than their default. In fact, this principle is quite important to hexing and cleansing, and determines what is a lousy hex and what is a powerful, soul scrubbing magick cleanse.",
            "",
            "§lChecking Ambience§r",
            "Mundane Ambience is notoriously difficult to percieve. There are simple way too much ritul decors to consider usually. Additionally, there is no book any author has written currently that contains ALL the blocks that add to ambience. There is a quick solution though.",
            "",
            "§aUsing Natural Ash on a Central Slate§r draws in ambience and (after around 8 seconds)gives a breakdown of the ambience in the area around. It is not advised to add anything to the area during this divinatory technique.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.energies"
                    }
                ]
            } // Back
        ]
    },
    "ceremony.energies.orbos": {
        "title": "Mystic Energies",
        "body": [
            "At the Mystic level, not every Witch goes through the trouble of configuring mystically relevant blocks into a powerful ritual space. Others simply need a way to pull off a simple but necessary ritual without too many props.",
            "",
            "Once a Witch has ascended, they are able to draw in and gather §dorbos§r. By activating the Central Slate with all the other necessities in place, the ritual will use the Witch's orbos to try and perform its intended effect. Without enough of the mystical energy, the Central Slate will try to use the local Ambience to supplement the ceremony. When this happens, it is important to note that Ambient Energy and Orbos are NOT equal and every 5 AE is equivalent to 1 Orbos. If this combination of avaliable energies still isn't enough, the ritual will simply fail.",
            "",
            "As mentioned above, this can only be done by ascended Witches. However, it should be remembered that if a Witch uses a Ceremonial Scroll to activate their ceremony, the ritual will ALWAYS ignore Orbos to draw in Ambient Energies so if this method is your preferred one, your wand and the correct formation is foundational to your success.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "ceremony.energies"
                    }
                ]
            } // Back
        ]
    },

    "ceremony.activation": {
        "title": "Ritual Activation",
        "body": [
            "A ceremony requires formations (usually) and sufficient energy (whether that may be ambient or mystical) but there is still the two most important aspects: the ritual items and conditions.",
            "",
            "§lRitual Items§r",
            "All rituals have item components that are thrown around the general vicinity of the Central Slate. For the ritual to even have a chance of working, these items MUST be present.",
            "",
            "Bundles and bundle-like items may be used as a way of keeping ritual items in one place. Ceremonies will always ignore these items in favor of what's inside them. Aside from this however, ensure that the items line up with the ritual you are attempting, and are still present by the time the ritual finishes building its power.",
            "",
            "§lConditions§r",
            "Most Ceremonies do not have conditions for their use but there ARE a few that do. These conditions can look like:",
            "- requiring the Witch to have a Familiar,",
            "- needing the weather to be rainy,",
            "- needing the moon to be full.",
            "",
            "Conditions should ALWAYS be read and considered carefully because failing to meet one does not always mean the ritual will do nothing. Regardless of whether conditions are met or not, the ritual items are gobbled up so this serves as an even greater reason to make note of these things.",
            "",
            "Conditions are usually related to Correspondences. This means that to meet certain conditions, the correct ritual decor that draws on said Correspondence should be present in the area (even if Mundane Ambience isn't being used). In all cases, these things tend to be noted down in the ritual instructions so this shouldn't be much cause for concern.",
            "",
            "§lCeremonial Activation§r",
            "A ceremony is activated by either using a Wand or Ceremonial Scroll on the Central Slate. If all ritual items are present, it will begin building its power, which is both a visual and auditory process. This building of power always takes §a37 seconds§r to complete, after which three tolls of a bell can be heard.",
            "",
            "The ceremony will then gobble up all the items that should still be present at the Central Slate and, if all is well, the ritual is completed. After the successful ritual, some amount of §dfatigue§r will settle over its participants.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "intro"
                    }
                ]
            } // Back
        ]
    },

    "ceremony.consequences": {
        "title": "Ritual Consequences",
        "body": [
            "After a successful ritual, there are naturally consequences. A Witch expends energy and effort when doing a ritual, and it is not just through gathered energy. You (and your coven mates) are directing your intent towards a purpose and demanding that forces beyond description fulfil them. When such a working works, it yanks you closer to them and this generates §dFatigue§r.",
            "",
            "Fatigue in low amounts is not harmful in any way but once it moves above the 80% marker, it begins having adverse effects on the fatigued Witch. At very high values, it can even be fatal.",
            "",
            "Fatigue does not naturally decrease. However, it can be reduced by eating nutritional foods, and completely removed by having a good sleep or drinking Orbos Honey.",
            "",
            "§lIgnoring Conditions§r",
            "Another potential consequence lies in ignoring Conditions. The effects of this can cause a ritual to do nothing, which wastes your energy, time and generates fatigue. There are instances when something §odoes§r happen though, and it is usually not a wanted result... Thankfully, such things are usually noted down alongside the ritual requirements. Usually.",
            "",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "intro"
                    }
                ]
            } // Back
        ]
    },

    "ceremony.next_steps": {
        "title": "Next Steps",
        "body": [
            "And with that, the basics of the Ceremonial Arts have been laid out for you. As you might have noticed, this book did not leave any actual rituals to be performed. There are a variety of rituals that exist and many of them I know. However, I feel there is value in discovery and so you may need to find records of them in structures yourself. I'm not cruel though; there is a small collection of basic rites in the §aEveryday Rites & Rituals§r that you might use for your practice and utility.",
            "",
            "It should be noted that some of these rituals to be discovered are important for your progression in the Bewitching Arts, so do try to collect or see them at least once. Their contents are not likely to change.",
            "",
            "Continuing onwards from Ceremonies and their intricacies, we will discuss the Faeries. Be warned, they are poorly understood aspects of the natural world (though some would disagree), and dealings with them can be hazardous to one's health and peace. All of this is discussed at some length in §aYour Future & the Fae§r.",
            "",
            "If you have not ascended to Mystic status, this is the time to do so. Naturally, it is a Ceremony but it is one of those rare few that come with a few benefits necessary for workings beyond the capacity of Mundane Witches. For the actual ceremony instructions and a brief look at the benefits, I. Ivers has written a fascinating book on it titled §aAscending Mundanity§r.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "intro"
                    }
                ]
            } // Back
        ]
    }
}