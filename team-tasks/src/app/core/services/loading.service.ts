import { Injectable, signal } from '@angular/core';

/**
 * Loading Service - ניהול מצב טעינה גלובלי
 */
@Injectable({ providedIn: 'root' })
export class LoadingService {
  private loadingCount = 0;
  
  // Signal למצב טעינה
  readonly isLoading = signal<boolean>(false);

  /**
   * הצג spinner
   */
  show(): void {
    this.loadingCount++;
    this.isLoading.set(true);
  }

  /**
   * הסתר spinner (רק כשכל הבקשות הסתיימו)
   */
  hide(): void {
    this.loadingCount--;
    
    if (this.loadingCount <= 0) {
      this.loadingCount = 0;
      this.isLoading.set(false);
    }
  }

  /**
   * איפוס מלא
   */
  reset(): void {
    this.loadingCount = 0;
    this.isLoading.set(false);
  }
}