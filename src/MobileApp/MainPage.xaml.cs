using Microsoft.Maui.Controls;
using System.Collections.ObjectModel;
using Shared.Models;

namespace MobileApp
{
    public partial class MainPage : ContentPage
    {
        public ObservableCollection<InstrumentDto> Instruments { get; set; } = new();

        public MainPage()
        {
            InitializeComponent();
            BindingContext = this;
            
            // Example instruments - in real app load from API
            Instruments.Add(new InstrumentDto 
            { 
                Id = System.Guid.NewGuid(), 
                Name = "Tambourine", 
                DefaultBpm = 120, 
                AudioUrl = "https://example.com/uploads/tambourine.mp3" 
            });
            Instruments.Add(new InstrumentDto 
            { 
                Id = System.Guid.NewGuid(), 
                Name = "Gome - 1", 
                DefaultBpm = 120, 
                AudioUrl = "https://example.com/uploads/gome1.mp3" 
            });
        }
    }
}
