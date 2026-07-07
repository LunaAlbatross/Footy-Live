/* eslint-disable @typescript-eslint/no-explicit-any */

import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs));
}

export function formatMinute(minute: number, extraMinute?: number): string {
  if (extraMinute) {
    return `${minute}+${extraMinute}'`;
  }
  return `${minute}'`;
}

export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
  });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'LIVE': 'text-red-500 bg-red-500/10 border-red-500/20',
    'IN_PLAY': 'text-red-500 bg-red-500/10 border-red-500/20',
    'SCHEDULED': 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    'FINISHED': 'text-green-500 bg-green-500/10 border-green-500/20',
    'PAUSED': 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    'POSTPONED': 'text-gray-500 bg-gray-500/10 border-gray-500/20',
    'CANCELLED': 'text-gray-500 bg-gray-500/10 border-gray-500/20',
  };
  return colors[status] || colors['SCHEDULED'];
}

export function getStatusBadge(status: string): string {
  if (status === 'LIVE' || status === 'IN_PLAY') {
    return 'LIVE';
  }
  return status;
}

export function getEventIcon(type: string): string {
  const icons: Record<string, string> = {
    'goal': '⚽',
    'penalty': '🎯',
    'own_goal': '🥅',
    'card': '🟨',
    'substitution': '🔄',
    'foul': '⚠️',
    'var': '📺',
  };
  return icons[type] || '📍';
}

export function getEventColor(type: string): string {
  const colors: Record<string, string> = {
    'goal': 'text-green-500 bg-green-500/10',
    'penalty': 'text-green-500 bg-green-500/10',
    'own_goal': 'text-yellow-500 bg-yellow-500/10',
    'card': 'text-yellow-500 bg-yellow-500/10',
    'substitution': 'text-blue-500 bg-blue-500/10',
    'foul': 'text-orange-500 bg-orange-500/10',
    'var': 'text-purple-500 bg-purple-500/10',
  };
  return colors[type] || colors['foul'];
}

export function getPositionCoordinates(
  position: string,
  index: number,
  formation: string,
  side: 'home' | 'away'
): { x: number; y: number } {
  const formations: Record<string, number[][]> = {
    '4-4-2': [[50], [20, 40, 60, 80], [20, 40, 60, 80], [35, 65]],
    '4-3-3': [[50], [20, 40, 60, 80], [35, 50, 65], [25, 50, 75]],
    '4-2-3-1': [[50], [20, 40, 60, 80], [35, 65], [25, 50, 75], [50]],
    '3-5-2': [[50], [30, 50, 70], [15, 35, 50, 65, 85], [35, 65]],
    '3-4-3': [[50], [30, 50, 70], [20, 40, 60, 80], [25, 50, 75]],
    '5-3-2': [[50], [15, 30, 50, 70, 85], [35, 50, 65], [35, 65]],
  };

  const formationPositions = formations[formation] || formations['4-4-2'];
  
  let rowIndex = 0;
  let positionIndex = index;
  
  for (let i = 0; i < formationPositions.length; i++) {
    if (positionIndex < formationPositions[i].length) {
      rowIndex = i;
      break;
    }
    positionIndex -= formationPositions[i].length;
    rowIndex = i + 1;
  }

  const totalRows = formationPositions.length;
  const yBase = side === 'home' ? 90 : 10;
  const yDirection = side === 'home' ? -1 : 1;
  const ySpacing = 70 / (totalRows - 1 || 1);
  
  const x = formationPositions[rowIndex]?.[positionIndex] || 50;
  const y = yBase + (yDirection * rowIndex * ySpacing);

  return { x, y: Math.max(5, Math.min(95, y)) };
}

export function parseFormation(formation: string): number[] {
  return formation.split('-').map(n => parseInt(n, 10));
}

export function calculatePossessionBar(possession: { home: number; away: number }): { homeWidth: string; awayWidth: string } {
  const total = possession.home + possession.away;
  if (total === 0) return { homeWidth: '50%', awayWidth: '50%' };
  
  const homePercent = (possession.home / total) * 100;
  return {
    homeWidth: `${homePercent}%`,
    awayWidth: `${100 - homePercent}%`,
  };
}

export function generateMomentumData(events: any[]): { minute: number; value: number; event?: string }[] {
  const momentum: { minute: number; value: number; event?: string }[] = [];
  let homeValue = 50;
  
  for (let minute = 0; minute <= 90; minute += 5) {
    const eventsAtMinute = events.filter(e => e.minute <= minute && e.minute > minute - 5);
    
    eventsAtMinute.forEach(event => {
      if (event.type === 'goal') {
        homeValue += event.teamId % 2 === 1 ? 15 : -15;
      } else if (event.type === 'card' && event.cardType === 'red') {
        homeValue += event.teamId % 2 === 1 ? -10 : 10;
      } else if (event.type === 'card') {
        homeValue += event.teamId % 2 === 1 ? -3 : 3;
      }
    });
    
    homeValue = Math.max(20, Math.min(80, homeValue));
    momentum.push({
      minute,
      value: homeValue,
      event: eventsAtMinute.find(e => e.type === 'goal')?.type,
    });
  }
  
  return momentum;
}