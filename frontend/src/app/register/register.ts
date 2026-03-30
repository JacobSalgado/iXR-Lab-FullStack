import { Component, AfterViewInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent implements AfterViewInit {
  ngAfterViewInit() {
    const consentBox = document.getElementById('consent') as HTMLInputElement;
    const submitBtn = document.querySelector('button[type="submit"]') as HTMLButtonElement;
    
    const updateSubmit = () => {
      submitBtn.disabled = !consentBox.checked;
      submitBtn.style.opacity = consentBox.checked ? '1' : '0.45';
      submitBtn.style.cursor = consentBox.checked ? 'pointer' : 'not-allowed';
    };
    
    consentBox.addEventListener('change', updateSubmit);
    updateSubmit();
  }
}
