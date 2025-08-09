import { FeaturedMeals } from "@/components/featured-meals";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { getMealsAction } from "@/actions/meals";

export default async function HomePage() {
  const res = await getMealsAction();

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <section className="relative bg-orange-500 text-white py-20 px-4 overflow-hidden rounded-b-xl shadow-lg">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between z-10 relative">
          <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
              Are you starving?
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Find and order your favorite meals with ease!
            </p>
            <div className="flex w-full max-w-md mx-auto md:mx-0">
              <Input
                type="text"
                placeholder="Search for meals..."
                className="flex-grow p-3 rounded-l-lg border-none focus:ring-2 focus:ring-white bg-white text-gray-800 placeholder-gray-500 shadow-md"
              />
              <Button className="bg-orange-700 hover:bg-orange-800 text-white p-3 rounded-r-lg shadow-md transition duration-200">
                Search
              </Button>
            </div>
          </div>
          <div className="md:w-1/2 flex justify-center items-center">
            <Image
              src="https://placehold.co/400x300/fcd34d/b45309?text=Delicious+Meal"
              alt="Delicious meal"
              width={400}
              height={300}
              className="rounded-full shadow-2xl border-4 border-white transform rotate-3 hover:rotate-0 transition-transform duration-300"
            />
          </div>
        </div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute w-48 h-48 bg-orange-400 rounded-full -top-12 -left-12 opacity-30 blur-xl"></div>
          <div className="absolute w-64 h-64 bg-yellow-300 rounded-full -bottom-24 -right-24 opacity-30 blur-xl"></div>
        </div>
      </section>

      <FeaturedMeals meals={res.data?.meals || []} />

      <footer className="bg-gray-800 text-white py-8 px-4 mt-12 rounded-t-xl shadow-inner">
        <div className="container mx-auto text-center">
          <p className="text-lg mb-4">
            &copy; {new Date().getFullYear()} Meal App. All rights reserved.
          </p>
          <div className="flex justify-center space-x-6">
            <a
              href="#"
              className="hover:text-orange-400 transition duration-200"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="hover:text-orange-400 transition duration-200"
            >
              Terms of Service
            </a>
            <a
              href="#"
              className="hover:text-orange-400 transition duration-200"
            >
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
