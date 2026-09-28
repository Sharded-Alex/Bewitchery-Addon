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
                        "form": "jacks.dusting"
                    }
                ]
            },
            {
                "buttonName": "Optional Additions",
                "buttonIcon": "textures/items/dusts/poppy_dust",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jacks.additions"
                    }
                ]
            },
            {
                "buttonName": "Next Steps",
                "buttonIcon": "textures/blocks/",
                "onClick": [
                    {
                        "type": "openForm",
                        "form": "jacks.next_steps"
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
            "A Jack o' Ward must have two aspects before it is considered valid in the most basic sense: an §dEffect§r and a §6Trigger§r. These aspects are determined by the dusts used on the Pumpkin, and each dust carries both aspects. What determines which aspect is used is their order; §dthe first dust defines the Effect§r and §6the second dust defines the Trigger§r.",
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
                        "form": "jacks.dusting.dusts"
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
                        "form": "jacks.dusting.dusts.dandelion"
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
    "jacks.dusting.dusts.dandelion": {
        "title": "Dandelion Dust",
        "body": [
            "§dEffect§r: Revealing",
            "§o§r",
            "",
            "§6Trigger§r: Pressure Plates",
            "§o§r",
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
