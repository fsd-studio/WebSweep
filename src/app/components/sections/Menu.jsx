'use client';

import Section from "../ui/Section";
import FSDImage from "../ui/FSDImage";

function Menu () {
    return (
        <Section className={'bg-secondary'}>
            <div className="h-dvh">
                <div className="mx-32">
                    <h1 className="text-6xl font-bold text-primary w-fit mx-auto">Restaurant</h1>
                    <h1 className="text-6xl font-bold text-primary w-fit mx-auto ps-32 pb-12">Menu</h1>
                    <hr className="h-1 bg-primary rounded"/>
                    <div className="flex mt-15 justify-evenly">
                        <div>
                            <div className="">
                                <h2 className="text-4xl font-bold text-primary">DRINKS</h2>
                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Aperol Spritz</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>

                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Negroni</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>                                
                                <p>These are all the ingridients</p>

                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Cosmopolitan</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>
                            </div>
                            <div className="mt-10">
                                <h2 className="text-4xl font-bold text-primary">APPETIZERS</h2>
                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Cheese Plate</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>

                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Bruschetta</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>

                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Fruit Salad</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>
                            </div>
                        </div>
                        <div>
                            <div className="">
                                <h2 className="text-4xl font-bold text-primary">MEALS</h2>
                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Steak</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>

                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Pizza</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>

                                <div className="flex justify-between">
                                    <h3 className="text-2xl">Hamburger</h3>
                                    <h3 className="text-2xl ms-40">10€</h3>
                                </div>
                                <p>These are all the ingridients</p>
                            </div>
                            {/* <FSDImage src="/template/meal.png"></FSDImage> */}
                        </div>
                    </div>
                </div>
            </div>
        </Section>
    )
}

export default Menu;