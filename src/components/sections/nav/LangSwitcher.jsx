import "flag-icons/css/flag-icons.min.css";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import { useRouter } from "next/router";

function LangSwitcher() {
    return (
        <>
        </>
    );
}

export function LangSwitcherMobile() {
    const { t } = useTranslation('common');

    return (
        <div className="space-x-2 mt-4">
            <Link 
            locale="hu"
            href="/"><span className="!h-9 !w-12 rounded-xl fi fi-hu"></span></Link>
            <Link 
            locale="en"
            href="/"><span className="!h-9 !w-12 rounded-xl fi fi-gb"></span></Link>
            <Link 
            locale="de"
            href="/"><span className="!h-9 !w-12 rounded-xl fi fi-de"></span></Link>
        </div>
    );
}

export function LangSwitcherMinimalist() {
    const { t } = useTranslation('common');
    const router = useRouter();

    return (
        <div className="flex space-x-3 lg:text-2xl font-serif text-primary">
            <Link 
            locale="hu"
            href="/"><p className={`${router.locale === 'hu' ? 'underline underline-offset-3' : ''} rounded-xl`}>hu</p></Link>
            <Link 
            locale="en"
            href="/"><p className={`${router.locale === 'en' ? 'underline underline-offset-3' : ''} rounded-xl`}>en</p></Link>
            <Link 
            locale="de"
            href="/"><p className={`${router.locale === 'de' ? 'underline underline-offset-3' : ''} rounded-xl`}>de</p></Link>
        </div>
    );
}

export default LangSwitcher;