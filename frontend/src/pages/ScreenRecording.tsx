import { useState } from "react";
import { CustomButton as Button } from "@/components/ui/custom-button"; // Corrected import path and alias
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Corrected import path
import { Play, Upload, Monitor } from "lucide-react";

export default function ScreenRecording() {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState([
        { id: 1, title: "React Component Development", duration: "23:45", date: "2024-05-10", verified: true },
        { id: 2, title: "API Integration Work", duration: "45:12", date: "2024-05-08", verified: true }
    ]);

    const handleStartRecording = () => {
        setIsRecording(true);
        // In a real implementation, this would start the screen recording
        console.log("Start recording...");
    };

    const handleStopRecording = () => {
        setIsRecording(false);
        // In a real implementation, this would stop the recording and save it
        console.log("Stop recording...");

        // Mock adding a new recording
        const newRecording = {
            id: recordings.length + 1,
            title: "New Recording",
            duration: "10:30",
            date: new Date().toISOString().split('T')[0],
            verified: false
        };

        setRecordings([newRecording, ...recordings]);
    };

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <div className="flex-1 flex pt-16"> {/* Adjusted pt for Navbar height */}

                <main className="flex-1 p-6 md:p-8 overflow-auto">
                    <h1 className="text-2xl font-bold mb-6">Screen Recording</h1>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Record Work Session</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground mb-4">
                                Record your screen while working to provide verification of your progress.
                                The AI will analyze your recording to create a summary of your work.
                            </p>

                            <div className="flex gap-4">
                                {!isRecording ? (
                                    <Button onClick={handleStartRecording}>
                                        <Play className="mr-2 h-4 w-4" />
                                        Start Recording
                                    </Button>
                                ) : (
                                    <Button variant="secondary" onClick={handleStopRecording}> {/* Changed variant to secondary */}
                                        Stop Recording
                                    </Button>
                                )}

                                <Button variant="outline">
                                    <Upload className="mr-2 h-4 w-4" />
                                    Upload Recording
                                </Button>
                            </div>

                            {isRecording && (
                                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-center">
                                    <div className="w-3 h-3 bg-red-500 rounded-full mr-3 animate-pulse"></div>
                                    <span className="text-red-600">Recording in progress...</span>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Recordings</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {recordings.length === 0 ? (
                                <p className="text-center text-muted-foreground py-6">
                                    No recordings available yet.
                                </p>
                            ) : (
                                <div className="space-y-4">
                                    {recordings.map(recording => (
                                        <div key={recording.id} className="flex items-center justify-between p-4 border rounded-lg">
                                            <div className="flex items-center">
                                                <Monitor className="h-5 w-5 mr-3 text-muted-foreground" />
                                                <div>
                                                    <h3 className="font-medium">{recording.title}</h3>
                                                    <p className="text-sm text-muted-foreground">
                                                        {recording.date} • {recording.duration}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {recording.verified && (
                                                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full mr-3">
                                                        AI Verified
                                                    </span>
                                                )}
                                                <Button variant="outline" size="sm">View</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}
