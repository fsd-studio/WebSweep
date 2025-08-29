'use client';

import Section from "../../ui/Section";
import FSDImage from "../../ui/FSDImage";
import Meal from "/public/template/meal.png";

function Menu ({
    menu = {
        section1: {
            name: 'DRINKS',
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
                ingredients: 'These are the ingredients'
            },
            item4: {
                name: 'Item1',
                price: '10€',
                ingredients: 'These are the ingredients'
            }
        },section2: {
            name: 'MEALS',
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
                ingredients: 'These are the ingredients'
            },
            item4: {
                name: 'Item1',
                price: '10€',
                ingredients: 'These are the ingredients'
            }
        },section3: {
            name: 'DESSERTS',
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
                ingredients: 'These are the ingredients'
            },
            item4: {
                name: 'Item1',
                price: '10€',
                ingredients: 'These are the ingredients'
            }
        },
    }
}) {

    const menuSections = Object.values(menu);

    return (
        <Section className={'bg-secondary'}>
            <div className="min-h-dvh">
                <div className="lg:mx-32">
                    <h1 className="text-5xl font-bold text-primary text-center mb-5">Restaurant<br/>Menu</h1>
                    <hr className="h-1 bg-primary rounded w-[80%] mx-auto"/>
                    <div className="grid grid-cols-1 md:grid-cols-2 mt-10 gap-8 md:gap-x-12 lg:gap-x-18">
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
                                                    <p>{item.ingredients}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    FSD
                </div>
            </div>
        </Section>
    )
}

export default Menu;