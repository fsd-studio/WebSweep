'use client';

import Section from "../../ui/Section";
import FSDImage from "../../ui/FSDImage";
import Meal from "/public/template/meal.png";
import { it } from "vitest";

function MenuElegant ({
    food = {
        item1: {
            name: 'Item1',
            price: '10€',
            ingredients: 'We need a longer description to see if it would look good.',
            pic: Meal
        },
        item2: {
            name: 'Item1',
            price: '10€',
            ingredients: 'These are the ingredients',
            pic: Meal
        },
        item3: {
            name: 'Item1',
            price: '10€',
            ingredients: 'These are the ingredients',
            pic: Meal
        },
        item4: {
            name: 'Item1',
            price: '10€',
            ingredients: 'These are the ingredients',
            pic: Meal
        }
    },
    menu = {
        section1: {
            name: 'Beverages',
            item1: {
                name: 'Item1',
                price: '10€',
                ingredients: 'These are the ingredients'
            },
            item2: {
                name: 'Item1',
                price: '10€',
                ingredients: 'These are the ingredients'
            },
            item3: {
                name: 'Item1',
                price: '10€',
            },
            item4: {
                name: 'Item1',
                price: '10€',
            }
        },section2: {
            name: 'Desserts',
            item1: {
                name: 'Item1',
                price: '10€',
            },
            item2: {
                name: 'Item1',
                price: '10€',
            },
            item3: {
                name: 'Item1',
                price: '10€',
            },
            item4: {
                name: 'Item1',
                price: '10€',
            }
        }
    }
}) {

    const foodSections = Object.values(food);
    const menuSections = Object.values(menu);

    return (
        <Section className={'bg-secondary'}>
            <div className="min-h-dvh lg:mx-50">
                <div className="">
                    <h1 className="text-6xl font-bold text-primary text-center">RESTAURANT MENU</h1>
                    <hr className="h-1 bg-primary rounded w-[80%] mx-auto my-10"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-x-12 lg:gap-x-18">
                        {foodSections.map((item, itemIndex) => {
                            return (
                                <div key={itemIndex} className="flex w-full justify-between gap-5">
                                    <div>
                                        <h3 className="text-2xl">{item.name}</h3>
                                        <h3 className="text-lg mb-3">{item.price}</h3>
                                        <p>{item.ingredients}</p>
                                    </div>
                                    <FSDImage src={item.pic} className="h-40 w-auto"></FSDImage>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <hr className="h-1 bg-primary rounded w-[80%] mx-auto my-10"/>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                    {menuSections.map((section, sectionIndex) => {
                        const sectionItems = Object.entries(section)
                        .filter(([key, value]) => key.startsWith('item'))
                        .map(([key, value]) => value);

                        return (
                            <div key={sectionIndex} className="w-full">
                                    <h2 className="text-3xl font-bold text-primary mb-5">{section.name}</h2>
                                    <div className="space-y-3">
                                        {sectionItems.map((item, itemIndex) => {
                                            return (
                                                <div key={itemIndex}>
                                                    <div className="flex justify-between text-xl">
                                                        <h3>{item.name}</h3>
                                                        <h3>{item.price}</h3>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                        )
                    })}
                </div>
            </div>
        </Section>
    )
}

export default MenuElegant;