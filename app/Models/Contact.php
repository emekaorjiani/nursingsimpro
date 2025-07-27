<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class Contact extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'institution',
        'message',
        'status',
        'is_read',
        'admin_response',
        'responded_at',
        'responded_by',
    ];

    protected $casts = [
        'is_read' => 'boolean',
        'responded_at' => 'datetime',
    ];

    public static function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'institution' => 'nullable|string|max:255',
            'message' => 'required|string|max:2000',
        ];
    }

    /**
     * Get the admin who responded to this contact
     */
    public function respondedBy(): BelongsTo
    {
        return $this->belongsTo(User::class, 'responded_by');
    }

    /**
     * Scope for unread contacts
     */
    public function scopeUnread($query)
    {
        return $query->where('is_read', false);
    }

    /**
     * Scope for new contacts
     */
    public function scopeNew($query)
    {
        return $query->where('status', 'new');
    }

    /**
     * Scope for recent contacts (last 30 days)
     */
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', Carbon::now()->subDays(30));
    }

    /**
     * Mark contact as read
     */
    public function markAsRead()
    {
        $this->update(['is_read' => true]);
    }

    /**
     * Mark contact as responded to
     */
    public function markAsResponded($response, $adminId)
    {
        $this->update([
            'admin_response' => $response,
            'responded_at' => now(),
            'responded_by' => $adminId,
            'status' => 'resolved',
            'is_read' => true,
        ]);
    }

    /**
     * Update contact status
     */
    public function updateStatus($status)
    {
        $this->update(['status' => $status]);
    }

    /**
     * Get formatted created date
     */
    public function getFormattedCreatedAtAttribute()
    {
        return $this->created_at->format('M j, Y \a\t g:i A');
    }

    /**
     * Get formatted responded date
     */
    public function getFormattedRespondedAtAttribute()
    {
        return $this->responded_at ? $this->responded_at->format('M j, Y \a\t g:i A') : null;
    }

    /**
     * Get status badge color
     */
    public function getStatusColorAttribute()
    {
        return match($this->status) {
            'new' => 'blue',
            'in_progress' => 'yellow',
            'resolved' => 'green',
            'closed' => 'gray',
            default => 'gray',
        };
    }

    /**
     * Check if contact has been responded to
     */
    public function hasResponse()
    {
        return !is_null($this->admin_response);
    }
}
