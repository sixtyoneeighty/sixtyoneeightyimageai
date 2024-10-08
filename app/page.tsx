import ImageGenerator from '@/components/ImageGenerator';

export default function Home() {
  return (
    <div 
      className="container mx-auto px-4 py-8" 
      style={{ backgroundColor: '#050307', backgroundSize: 'cover', borderWidth: '1px', borderStyle: 'solid', borderColor: '#000' }}
    >
      <ImageGenerator />
    </div>
  );
}