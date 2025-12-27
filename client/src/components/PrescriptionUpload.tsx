import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Upload, X, FileText } from "lucide-react";
import { useState } from "react";

interface PrescriptionUploadProps {
  children: React.ReactNode;
}

export function PrescriptionUpload({ children }: PrescriptionUploadProps) {
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = () => {
    // In a real app, this would upload the file to a server
    console.log("Uploading file:", file);
    setOpen(false);
    setFile(null);
  };

  return (
    <>
      <div onClick={() => setOpen(true)} className="contents">
        {children}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md p-0 overflow-hidden border-none bg-white rounded-2xl shadow-2xl">
          <div className="p-6">
            <DialogHeader className="mb-6">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-slate-900">Upload Prescription</DialogTitle>
              </div>
              <DialogDescription className="text-sm text-slate-500 mt-2">
                Upload your doctor's prescription (PDF, JPG, or PNG). We'll review it and help you book the right tests.
              </DialogDescription>
            </DialogHeader>

            <div 
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all ${
                file ? 'border-blue-400 bg-blue-50/50' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50'
              }`}
            >
              <input
                type="file"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileChange}
                accept=".pdf,.jpg,.jpeg,.png"
              />
              
              {file ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-3">
                    <FileText size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-900 truncate max-w-[200px]">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="mt-4 text-xs font-semibold text-red-500 hover:text-red-600"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mb-4 transition-colors group-hover:bg-blue-100 group-hover:text-blue-500">
                    <Upload size={24} />
                  </div>
                  <p className="text-sm font-medium text-slate-900">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    PDF, JPG, PNG (max 10MB)
                  </p>
                </>
              )}
            </div>

            <Button 
              className="w-full mt-6 h-12 text-base font-bold bg-blue-400 hover:bg-blue-500 text-white rounded-lg shadow-md shadow-blue-200"
              disabled={!file}
              onClick={handleUpload}
            >
              Upload & Book Tests
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
