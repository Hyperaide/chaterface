import { Geist_Mono } from "next/font/google"


const geistMono = Geist_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-geist-mono',
  display: 'swap',
  preload: true,
})

import Link from "next/link"
import Image from "next/image"
// import BlackLogomark from "@/public/black-logomark.svg"
import WhiteLogomark from "@/public/white-logomark.svg"

export default async function Page() {

  return (
    <div className="bg-gray-1 h-full min-h-screen flex flex-col divide-y divide-gray-3 relative">

      {/* <Hero navbarLinks={homepage.header.links.items} logos={homepage.heroSection.logosSection.logos.items.map((logo: any) => logo.image.url)} /> */}

      <div className="w-full">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 border-x border-gray-3 w-full flex flex-row justify-between items-center">
          <div className={`flex-shrink-0`}>
            <Link href="/" className={`flex items-center flex-row gap-1.5`}>
              <Image
                src={WhiteLogomark}
                alt="Logo"
                width={20}
                height={20}
                className="h-4 w-auto"
              />
              <span className={`text-gray-normal text-lg leading-none`}>Hyperaide</span>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-4">
              {[{label: "Home", path: "/"}, {label: "About", path: "/about"}, {label: "Contact", path: "/contact"}].map((link: any, index: any) => (
                <Link
                  key={index}
                  href={link.path}
                  className={`${geistMono.className} text-gray-dim hover:text-gray-normal text-xs font-medium uppercase transition-colors duration-300`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
        </div>
      </div>

      <div className="w-full">
        <div className="max-w-6xl mx-auto p-2 border-x border-gray-3 w-full">
          <div className="bg-white rounded-xl border border-gray-3 flex flex-col p-10 md:p-20 lg:p-40 shadow-sm">
            <h1 className="text-5xl font-semibold text-gray-normal text-center max-w-2xl mx-auto">Build your own personal assistant</h1>
            <p className="text mt-4 text-gray-dim text-center max-w-2xl mx-auto">Hyperaide is your AI-powered productivity assistant that streamlines task management, eliminates friction, and helps you accomplish more with less effort.</p>
          
            <div className="relative flex flex-wrap max-w-3xl gap-2 mt-8 items-center mx-auto">
            {[{label: "Get Started", path: "/", link: "https://web.hyperaide.com"}, {label: "Learn More", path: "/about", link: "https://web.hyperaide.com"}].map((button: any, index: any) => (
              button.textLink ?
              <Link href={button.link} key={index} className="flex flex-row gap-1 items-center ml-4 hover:translate-x-1 transition-all duration-300 text-gray-8 hover:text-gray-4">
                <div className="text-sm ">{button.label}</div>
                {/* <ArrowRight size={14} weight={2} className=" mt-1" /> */}
              </Link>
              :
              <Link key={index} href={button.link} className="text-sm bg-graydark-3 better-shadow border border-graydark-4 text-white font-medium px-4 py-2 rounded-lg hover:bg-graydark-4 hover:border-graydark-5 transition-all duration-300">{button.label}</Link>
            ))}
          </div>
          </div>

          
        </div>
      </div>

      {/* <div className="w-full">
        <div className="max-w-6xl mx-auto p-2 border-x border-gray-3 w-full pt-8 pb-12">
          <p className={`text-xs max-w-2xl text-pretty text-gray-dim uppercase font-medium text-center mx-auto ${geistMono.className}`}>{homepage.heroSection.logosSection.sectionSubtitle}</p>
          <div className="relative flex flex-wrap gap-16 mt-8 items-center justify-center">
          
            {homepage.heroSection.logosSection.logos.items.map((logo: any, index: any) => (
              <img key={index} src={logo.image.url} alt={logo.image.alt || 'Logo'} className="w-auto h-6 filter invert"/>
            ))}
          
          </div>
        </div>
      </div> */}

      <div className="w-full">
        <div className="max-w-6xl mx-auto p-2 border-x border-gray-3 w-full relative">
          {/* <img src={homepage.mainUiImage?.url || ''} alt={homepage.mainUiImage?.alt || 'UI'} className="w-auto w-full  border border-gray-3 rounded-lg hidden md:block"/> */}

          <div className="md:absolute md:w-1/2 h-full z-50 left-0 top-0 bg-gradient-to-br from-transparent to-gray-1">
          </div>
          <div className="md:absolute md:w-1/2 h-full bg-gray-1 z-50 right-0 top-0 p-10 md:p-20 flex flex-col justify-center">
            <p className={`text-xs text-gray-dim uppercase ${geistMono.className}`}>What is Hyperaide?</p>
            <h1 className="text-3xl font-medium text-gray-normal max-w-2xl mx-auto">A task manager on your computer.</h1>
            <p className="text mt-4 text-gray-dim max-w-2xl mx-auto">First and foremost, we are just like another traditional task manager. We are a place to manage your tasks, projects, and goals.</p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <div className="max-w-6xl mx-auto p-2 border-x border-gray-3 w-full relative">
          {/* <img src={homepage.mainUiImage?.url || ''} alt={homepage.mainUiImage?.alt || 'UI'} className="w-auto w-full  border border-gray-3 rounded-lg"/> */}

          <div className="md:absolute md:w-1/2 h-full z-50 right-0 top-0 bg-gradient-to-bl from-transparent to-gray-1">
          </div>
          <div className="md:absolute md:w-1/2 h-full bg-gray-1 z-50 left-0 top-0 p-10 md:p-20 flex flex-col justify-center">
            <p className={`text-xs text-gray-dim uppercase ${geistMono.className}`}>What is Hyperaide?</p>
            <h1 className="text-3xl font-medium text-gray-normal max-w-2xl">A conversation on the go.</h1>
            <p className="text mt-4 text-gray-dim max-w-2xl mx-auto">Hyperaide is your AI personal assistant you can talk to from many different communication channels to manage your tasks.</p>
          </div>
        </div>
      </div>

      <div className="w-full border-y border-gray-3">
        <div className="max-w-6xl border-x grid grid-cols-1 md:grid-cols-3 border-gray-3 divide-y md:divide-y-0 md:divide-x divide-gray-3 mx-auto px-4 sm:px-6 lg:px-8">
          <SectionCard 
            title="Frictionless." 
            subtitle="Add tasks from anywhere using your voice, keyboard, or your phone." 
          />
          <SectionCard 
            title="Proactive." 
            subtitle="Proactively check ins at regular cadences to keep you on track." 
          />
          <SectionCard 
            title="Available where you are." 
            subtitle="Integrates with the communication channels you use every day. Whatsapp, Telegram, Slack and more." 
          />
        </div>
      </div>

  <div className="w-full border-y border-gray-3">
    <div className="w-full max-w-6xl border-x border-gray-3 mx-auto p-2 bg-gray-2">
    <div className="w-full max-w-6xl relative">
      {/* <div className="absolute inset-0 bg-gradient-to-b from-gray-1 via-gray-1 via-gray-1 to-gray-1/90" /> */}
      <div className="z-20 relative">
        <div className="flex flex-col pt-20 pb-20">
          <div className="flex items-center justify-center w-20 h-20 bg-graydark-1 mx-auto rounded-3xl border border-graydark-3 better-shadow">
            <Image
              src={WhiteLogomark}
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-auto"
            />
          </div>
          <div className="flex flex-col gap-2 mx-auto text-center mt-10">
            <h1 className="text-gray-normal font-semibold text-3xl">Ready for AI powered productivity?</h1>
            <p className="text-gray-dim">Get started with Hyperaide today and experience the future of task management.</p>
            <Link href="https://web.hyperaide.com" className="w-max mx-auto mt-5 text-sm bg-graydark-3 better-shadow border border-graydark-4 text-white font-medium px-4 py-2 rounded-lg hover:bg-graydark-4 hover:border-graydark-5 transition-all duration-300">Get Started</Link>
          </div>
        </div>
      </div>
    </div>
    </div>

    {/* <Footer /> */}

    <div className="w-full border-t border-gray-3">
      <div className="w-full max-w-6xl border-x border-gray-3 mx-auto p-4 pb-40">
        <div className="flex flex-row gap-2 items-center justify-between">
          <div className="flex flex-col">
            <p className="text-xs font-semibold text-gray-dim"> Copyright © 2025 Hyperaide.</p>
          </div>
          {/* <div className="flex flex-col">
            <p className="text-xs font-semibold text-gray-dim"> Privacy Policy</p>
          </div> */}
        </div>
      </div>
    </div>
    
  </div>
  </div>
    
  )
}

const SectionCard = ({title, subtitle}: {title: string, subtitle: string}) => {
  return (
    <div className='flex flex-col group'>
      <div className="flex flex-col p-4 md:p-10 mt-5">
        <h2 className="text-xl font-semibold text-gray-normal">{title}</h2>
        <p className="text-gray-dim text-sm">{subtitle}</p>
        
      </div>
      <div className='relative h-full mt-5'>
        <div className='absolute inset-0 bg-gradient-to-t from-gray-1 to-transparent rounded-lg transition-all duration-300' />
      </div>
    </div>
  )
}