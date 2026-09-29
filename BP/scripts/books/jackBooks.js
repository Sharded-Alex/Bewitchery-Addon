export const jackBook = {
    "intro": {
        "title": "Pumpkin Magick",
        "body": [
            "There comes a time in every witch's journey when they realize that their space is sacred and their home or base or cottage must be protected or enhanced in some magical way. In times like these, a potion does not help. No ritual will work to provide the protection you want, and there is no spells you can use to reliably achieve the effect you desire. In times like these, only a branch of Ailillian magick can help you.",
            "",
            "I have not touched on the Fae so far, though I have mentioned them once or twice before. All of the Bewitched Arts is sourced by some Faerie force, even the ones that seem to not have their cunning influence. Naturally, pumpkin magick is no different; the Lord of Autumn is said to be the Faerie that taught the first witch how to make a gaurdian from pumpkins. It is said that his witches are natural prodigies of pumpkin wardcraft.",
            "",
            "Before you begin, you will need an Infused Pumpkin (which is a product of primal alchemy), a variety of crushed materials (which will naturally require a witch's workbench and a mortar and pestle) and Raw Orbos (another potential product of primal alchemy). Once you have those basic materials, you are ready to §denchant a Jack o' Ward§r.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Pumpkin Preparation",
                "buttonIcon": "textures/items/dusts/poppy_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting"
                    }
                ]
            },
            {
                "buttonName": "Optional Additions",
                "buttonIcon": "textures/items/dusts/poppy_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.additions"
                    }
                ]
            },
            {
                "buttonName": "Next Steps",
                "buttonIcon": "textures/blocks/",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.next_steps"
                    }
                ]
            },
        ]
    },

    "jack.dusting": {
        "title": "Pumpkin Preparation",
        "body": [
            "The very first thing you must do is place the Infused Pumpkin. It is the base of the enchantment you are crafting and so it needs to be set down. The second step is §dpreparing§r it.",
            "",
            "A Jack o' Ward must have two aspects before it is considered valid in the most basic sense: an §dEffect§r and a §6Trigger§r. These aspects are determined by the dusts used on the Infused Pumpkin, and each dust carries both aspects. What determines which aspect is used is their order; §dthe first dust defines the Effect§r and §6the second dust defines the Trigger§r.",
            "",
            "The Effect describes what the Jack o' Ward will do to the entities it affects, i.e. strikes a mob with lightning. The Trigger describes what causes the Jack o' Ward to activate and usually also describes how it find its potential targets i.e. activates when a mob steps on a tripwire and will only target the mobs that trigger said tripwire.",
            "",
            "I have included an exhaustive list of the dusts that can be used in Jack o' Wards in the below section called §aPumpkin Dusts§r. I have listed their effects, their triggers, and any additional components that might be required by either aspect to bring out their full effects.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Pumpkin Dusts",
                "buttonIcon": "textures/items/dusts/dandelion_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts"
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
    "jack.dusting.dusts": {
        "title": "Pumpkin Dusts",
        "body": [
            "§oAnd with a bronze hand, Autumn cast forth the crushed remains of Spring and Summer's children. Their multicolored dusts warbled and wound through the breeze, before landing lightly on his own patch of hungry gourds, and they ate them with a hunger befitting the Night. They ate and ate and ate, and from their feast, they learned.§r",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Dandelion Dust",
                "buttonIcon": "textures/items/dusts/dandelion_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts.dandelion"
                    }
                ]
            },
            {
                "buttonName": "Blue Orchid Dust",
                "buttonIcon": "textures/items/dusts/azure_bluet_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts.blue_orchid"
                    }
                ]
            },
            {
                "buttonName": "Cornflower Dust",
                "buttonIcon": "textures/items/dusts/cornflower_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts.cornflower"
                    }
                ]
            },
            {
                "buttonName": "Oxeye Daisy Dust",
                "buttonIcon": "textures/items/dusts/oxeye_daisy_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts.oxeye_daisy"
                    }
                ]
            },
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting"
                    }
                ]
            } // Back
        ]
    },
    "jack.dusting.dusts.dandelion": {
        "title": "Dandelion Dust",
        "body": [
            "§dEffect§r: Revealing",
            "Under this effect, the Jack o' Ward purges the affected creature of invisibility effects. Additionally, for a few seconds, particles continue to reveal their position.",
            "",
            "§6Trigger§r: Pressure Plates",
            "Causes the Ward to only trigger when a pressure plate is stepped on and triggered in the vicinity (default being 32 blocks in all directions). Usually, the associated Effect only targets the creature that triggered the pressure plate.",
            "",
            "§c[!]§r Condition Behavior: The Block Condition placed on a Ward with this Trigger checks to see if the block that is trying to trigger the Ward matches the block being used as the Condition. Exercise common sense; if the Block Condition does not point to a pressure plate of some kind, the Ward will never work.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts"
                    }
                ]
            } // Back
        ]
    },
    "jack.dusting.dusts.blue_orchid": {
        "title": "Blue Orchid Dust",
        "body": [
            "§dEffect§r: Transfiguration",
            "Under this effect, the Jack o' Ward transforms the affected creature into the creature defined. There are limitations, of course. For it to work, the affected creature must have equal health or be no less than 3 hearts below the target creature's maximum health. Eg. A zombie needs to have 5 hearts of health or less before the Ward can transform it into a chicken. A chicken with 1 heart can be transformed into a wolf by this Ward Effect. §cThis does not work on players.§r",
            "",
            "- (REQUIRED)§r The blood of the creature being transformed into needs to be dropped on top of the Infused Pumpkin when it is being hit with this dust.",
            "",
            "§6Trigger§r: When Hitting",
            "Causes the Ward to only trigger when a creature is melee attacking another creature within the vicinity (default being 32 blocks in all directions). The Effect attached affects the attacking creature.",
            "",
            "§c[!]§r Condition Behavior: The Item/Block Condition placed on a Ward with this Trigger checks the §dvictim's§r mainhand (if it can) instead of the attacker's.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts"
                    }
                ]
            } // Back
        ]
    },
    "jack.dusting.dusts.cornflower": {
        "title": "Cornflower Dust",
        "body": [
            "§dEffect§r: Strike",
            "Under this effect, the Jack o' Ward strikes the affected entity with a bolt of lightning.",
            "",
            "§6Trigger§r: When Being Hit",
            "Causes the Ward to only trigger when a creature is melee attacking another creature within the vicinity (default being 32 blocks in all directions). The Effect attached affects the victim of the attack.",
            "",
            "§c[!]§r Condition Behavior: The Item/Block Condition placed on a Ward with this Trigger checks the §dattacker's§r mainhand (if it can) instead of the victim's.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts"
                    }
                ]
            } // Back
        ]
    },
    "jack.dusting.dusts.oxeye_daisy": {
        "title": "Oxeye Daisy Dust",
        "body": [
            "§dEffect§r: Minor Alchemy",
            "Under this effect, the Jack o' Ward inflicts the defined potion effect on the affected creature at a capped power of I. If the creature already has that effect, it does nothing for them.",
            "",
            "- (REQUIRED)§r An Attuned Clay Totem with the captured effect needs to be dropped on top of the Infused Pumpkin when it is being hit with this dust. Note that only the potion effect type and duration is considered; the power of the effect will always be locked to I.",
            "",
            "§6Trigger§r: Lever Pull",
            "Causes the Ward to only trigger when a lever is pulled within the vicinity (default being 32 blocks in all directions). The Effect attached affects the creature that pulled it.",
            "",
            "§c[!]§r Condition Behavior: The Item/Block Condition placed on a Ward with this Trigger checks the creature that pulled the lever.",
            ""
        ],
        "buttons": [
            {
                "buttonName": "Back",
                "buttonIcon": "textures/ui/book_arrowleft_default",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jack.dusting.dusts"
                    }
                ]
            } // Back
        ]
    },


    "jack.next_steps": {
        "title": "Next Steps",
        "body": [
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
    }
}
