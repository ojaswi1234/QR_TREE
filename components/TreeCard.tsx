import Image from "next/image";
import { type Tree } from "@/utils/db";

interface TreeCardProps {
  tree: Tree;
}

export default function TreeCard({ tree }: TreeCardProps) {
  // Calculate dynamic age based on planted_date and initial age
  const calculateAge = () => {
    if (!tree.planted_date) return tree.age;
    
    const planted = new Date(tree.planted_date);
    const now = new Date();
    
    // Check if date is valid
    if (isNaN(planted.getTime())) return tree.age;

    // Difference in milliseconds
    const diffTime = now.getTime() - planted.getTime();
    
    // Convert to years (taking leap years roughly into account)
    const yearsAdded = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));
    
    // Ensure we don't return less than the initial age (in case of future dates)
    const currentAge = tree.age + Math.max(0, yearsAdded);
    
    return currentAge;
  };

  const dynamicAge = calculateAge();


  return (
    <div className="relative bg-white rounded-2xl p-6 shadow-md border border-green-200 transition-all hover:shadow-lg">
      {/* Common Name */}
      <div className="border-b border-green-50 pb-4 mb-4">
        <p className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
          Common Name
        </p>
        <h2 className="text-xl font-extrabold text-green-900">
          {tree.common_name}
        </h2>
      </div>

      {/* Absolute Image - Fixed positioning relative to card */}
      <div className="absolute top-6 right-6 w-20 h-20">
        <Image
          src="/images/banyan.png" // You can later update this to tree.image_url if available
          width={80}
          height={80}
          alt="tree icon"
          className="object-contain"
        />
      </div>

      <div className="space-y-6 mt-4">
        {/* Scientific Name */}
        <div>
          <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
            Scientific Name
          </h3>
          <p className="text-lg italic text-gray-700 font-medium">
            {tree.scientific_name}
          </p>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
            Description
          </h3>
          <p className="text-gray-600 leading-relaxed text-sm">
            {tree.description}
          </p>
        </div>

        {/* Benefits Array */}
        {tree.benefits && tree.benefits.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
              It&apos;s benefits include
            </h3>
            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              {tree.benefits.map((benefit: string, index: number) => (
                <li key={index}>{benefit}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Stats Section */}
        <div className="flex gap-8 pt-4 border-t border-green-50">
          <div>
            <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
              Age
            </h3>
            <p className="text-sm font-bold">{dynamicAge} years</p>
          </div>
          <div>
            <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
              Health Status
            </h3>
            <p className="text-sm font-bold text-green-700">
              {tree.health_status}
            </p>
          </div>
           <div>
            <h3 className="text-xs font-bold text-green-600 uppercase tracking-widest mb-1">
              Planted By
            </h3>
            <p className="text-sm font-bold text-green-700">
              {tree.planted_by}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
