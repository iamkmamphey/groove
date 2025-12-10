# Run Locally - Quickstart

## Prerequisites
- Visual Studio 2022/2023 with .NET MAUI workload (for MobileApp)
- .NET 7 SDK
- Node.js (optional for some admin tasks)
- audiowaveform and ffmpeg for waveform generation

## Steps
1. Open the solution in Visual Studio (create new solution and add projects from the /src folders).
2. Restore NuGet packages.
3. For the API:
   - Run the Api project. It serves instrument metadata.
4. For the Admin (Blazor):
   - Run the Admin project as Blazor WebAssembly.
5. For Mobile:
   - Open the MobileApp project and deploy to emulator or device.

Waveform generation:
- Use `infrastructure/WaveformGenerator/generate_waveform.sh` to create PNG waveforms from uploaded audio.

